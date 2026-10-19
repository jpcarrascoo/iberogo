"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PRESETS,
  SCENARIO_LABELS,
  TIERS,
  calculateRevenue,
  formatMXN,
  runLogicTests,
  validateInputs,
  type PricingInputs,
  type ScenarioKey,
} from "@/lib/pricing";
import { getPricingDb } from "@/lib/supabasePricing";

type FieldDef = {
  key: keyof PricingInputs;
  label: string;
  unit: string;
  source: string;
  step: number;
};

const FIELDS: FieldDef[] = [
  { key: "reachableStudents", label: "Reachable students", unit: "students", source: "Placeholder – verify with real enrollment", step: 100 },
  { key: "adoptionPct", label: "Adoption rate", unit: "% of reachable", source: "Assumption", step: 0.5 },
  { key: "plusSharePct", label: "Plus share", unit: "% of active users", source: "Assumption", step: 0.5 },
  { key: "passSharePct", label: "Campus Pass share", unit: "% of active users", source: "Assumption", step: 0.5 },
  { key: "plusPrice", label: "Plus price", unit: "MXN / month", source: "Set by IBEROGO", step: 1 },
  { key: "passPrice", label: "Campus Pass price", unit: "MXN / month", source: "Set by IBEROGO", step: 1 },
  { key: "ordersPerUser", label: "Orders per active user", unit: "orders / month", source: "Assumption", step: 1 },
  { key: "avgOrderValue", label: "Average order value", unit: "MXN", source: "Assumption", step: 5 },
  { key: "commissionPct", label: "Vendor commission", unit: "% per order", source: "Set by IBEROGO", step: 0.5 },
];

type SavedRow = {
  id: string;
  created_at: string;
  name: string;
  scenario: string;
  monthly_revenue: number;
  annual_revenue: number;
};

type ScenarioState = ScenarioKey | "custom";

async function fetchSaved(): Promise<{ rows: SavedRow[]; error: string }> {
  const db = getPricingDb();
  if (!db) {
    return {
      rows: [],
      error: "Supabase isn't configured: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.",
    };
  }
  const { data, error } = await db
    .from("pricing_scenarios")
    .select("id, created_at, name, scenario, monthly_revenue, annual_revenue")
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) return { rows: [], error: `Couldn't load saved scenarios: ${error.message}` };
  return { rows: (data ?? []) as SavedRow[], error: "" };
}

export default function PricingPage() {
  const [scenario, setScenario] = useState<ScenarioState>("base");
  const [inputs, setInputs] = useState<PricingInputs>(PRESETS.base);
  const [scenarioName, setScenarioName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState<SavedRow[]>([]);
  const [savedError, setSavedError] = useState("");

  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const result = useMemo(() => (errors.length ? null : calculateRevenue(inputs)), [inputs, errors]);
  const logicTests = useMemo(() => runLogicTests(), []);

  const loadSaved = useCallback(async () => {
    const { rows, error } = await fetchSaved();
    setSavedError(error);
    setSaved(rows);
  }, []);

  useEffect(() => {
    let active = true;
    fetchSaved().then(({ rows, error }) => {
      if (!active) return;
      setSavedError(error);
      setSaved(rows);
    });
    return () => {
      active = false;
    };
  }, []);

  function pickScenario(key: ScenarioKey) {
    setScenario(key);
    setInputs(PRESETS[key]);
    setSaveStatus("idle");
  }

  function updateField(key: keyof PricingInputs, raw: string) {
    setInputs((prev) => ({ ...prev, [key]: raw === "" ? Number.NaN : Number(raw) }));
    setScenario("custom");
    setSaveStatus("idle");
  }

  async function saveScenario() {
    if (!result) return;
    const db = getPricingDb();
    if (!db) {
      setSaveStatus("error");
      setSaveError("Supabase isn't configured, so the scenario wasn't saved.");
      return;
    }
    setSaveStatus("saving");
    const label = scenario === "custom" ? "Custom" : SCENARIO_LABELS[scenario];
    const { error } = await db.from("pricing_scenarios").insert({
      name: scenarioName.trim() || `${label} scenario`,
      scenario: label,
      inputs,
      monthly_revenue: result.monthlyTotal,
      annual_revenue: result.annualTotal,
    });
    if (error) {
      setSaveStatus("error");
      setSaveError(`Save failed: ${error.message}. Check that the pricing_scenarios table and its RLS policies exist.`);
      return;
    }
    setSaveStatus("saved");
    setScenarioName("");
    loadSaved();
  }

  const scenarioLabel = scenario === "custom" ? "Custom" : SCENARIO_LABELS[scenario];
  const subShare = result && result.monthlyTotal > 0 ? (result.subscriptionMonthly / result.monthlyTotal) * 100 : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-black dark:text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Pricing simulator</h1>
        <p className="mt-3 max-w-2xl text-black/60 dark:text-white/60">
          IBEROGO earns from two sides: optional student subscriptions and a commission vendors pay per order. Every
          number below is an editable assumption. This models revenue only, not costs or profit.
        </p>
        <Link href="/product" className="mt-4 inline-block text-red-700 dark:text-red-400 underline underline-offset-4 hover:text-red-600">
          See which features each tier includes
        </Link>
      </header>

      {/* Tiers */}
      <section aria-labelledby="tiers-heading" className="mb-12">
        <h2 id="tiers-heading" className="mb-4 text-xl font-semibold">
          Student tiers
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <article key={t.name} className="rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] p-5">
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 text-2xl font-semibold">
                {t.price === 0 ? "Free" : formatMXN(t.price)}
                {t.price > 0 && <span className="text-sm font-normal text-black/60 dark:text-white/60"> / month</span>}
              </p>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{t.summary}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-black/75 dark:text-white/75">
                {t.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-dashed border-black/15 dark:border-white/20 p-5">
          <h3 className="font-semibold">Campus vendors</h3>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            {inputs.commissionPct >= 0 && Number.isFinite(inputs.commissionPct) ? inputs.commissionPct : 5}% commission on each
            order placed through IBEROGO. Nothing up front.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section aria-labelledby="calc-heading" className="mb-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="calc-heading" className="text-xl font-semibold">
            Revenue calculator
          </h2>
          <div role="group" aria-label="Scenario" className="inline-flex rounded-lg border border-black/10 dark:border-white/10 p-1">
            {(Object.keys(PRESETS) as ScenarioKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => pickScenario(key)}
                aria-pressed={scenario === key}
                className={`rounded-md px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 ${
                  scenario === key ? "bg-black dark:bg-white font-medium text-white dark:text-black" : "text-black/75 dark:text-white/75 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {SCENARIO_LABELS[key]}
              </button>
            ))}
            {scenario === "custom" && <span className="px-3 py-1.5 text-sm text-amber-700 dark:text-amber-300">Custom</span>}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.key} className="block text-sm">
                <span className="text-black/75 dark:text-white/75">{f.label}</span>
                <span className="ml-1 text-black/50 dark:text-white/45">({f.unit})</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={f.step}
                  value={Number.isFinite(inputs[f.key]) ? inputs[f.key] : ""}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  className="mt-1 w-full rounded-md border border-black/15 dark:border-white/20 bg-white dark:bg-neutral-950 px-3 py-2 text-black dark:text-white focus:border-red-600 focus:outline-none"
                />
              </label>
            ))}
          </div>

          <div aria-live="polite" className="rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] p-5">
            <h3 className="text-sm text-black/60 dark:text-white/60">{scenarioLabel} scenario</h3>
            {errors.length > 0 || !result ? (
              <div role="alert" className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-200">
                <p className="font-medium">Fix these inputs to see revenue:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm text-black/60 dark:text-white/60">Monthly revenue</p>
                <p className="text-3xl font-semibold">{formatMXN(result.monthlyTotal)}</p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {formatMXN(result.annualTotal)} per year
                </p>
                <dl className="mt-5 space-y-2 border-t border-black/10 dark:border-white/10 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-black/60 dark:text-white/60">Active users</dt>
                    <dd>{result.activeUsers.toLocaleString("es-MX")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-black/60 dark:text-white/60">Student subscriptions</dt>
                    <dd>{formatMXN(result.subscriptionMonthly)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-black/60 dark:text-white/60">Vendor commission</dt>
                    <dd>{formatMXN(result.vendorMonthly)}</dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <div className="flex h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10" aria-hidden="true">
                    <div className="bg-red-600" style={{ width: `${subShare}%` }} />
                    <div className="flex-1 bg-neutral-400" />
                  </div>
                  <p className="mt-2 text-xs text-black/60 dark:text-white/60">
                    {subShare.toFixed(0)}% from subscriptions, {(100 - subShare).toFixed(0)}% from vendors
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 border-t border-black/10 dark:border-white/10 pt-4">
              <label className="block text-sm">
                <span className="text-black/75 dark:text-white/75">Scenario name (optional)</span>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder={`${scenarioLabel} scenario`}
                  maxLength={80}
                  className="mt-1 w-full rounded-md border border-black/15 dark:border-white/20 bg-white dark:bg-neutral-950 px-3 py-2 text-black dark:text-white focus:border-red-600 focus:outline-none"
                />
              </label>
              <button
                type="button"
                onClick={saveScenario}
                disabled={!result || saveStatus === "saving"}
                className="mt-3 w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:bg-black/25 dark:disabled:bg-white/20 disabled:text-white/80"
              >
                {saveStatus === "saving" ? "Saving…" : "Save scenario"}
              </button>
              {saveStatus === "saved" && <p className="mt-2 text-sm text-green-700 dark:text-green-400">Saved ✓</p>}
              {saveStatus === "error" && <p className="mt-2 text-sm text-red-700 dark:text-red-300">{saveError}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Assumptions */}
      <section aria-labelledby="assumptions-heading" className="mb-12">
        <h2 id="assumptions-heading" className="mb-4 text-xl font-semibold">
          Assumptions
        </h2>
        <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5 text-black/75 dark:text-white/75">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Input</th>
                <th scope="col" className="px-4 py-3 font-medium">Current value</th>
                <th scope="col" className="px-4 py-3 font-medium">Unit</th>
                <th scope="col" className="px-4 py-3 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {FIELDS.map((f) => (
                <tr key={f.key}>
                  <td className="px-4 py-2.5">{f.label}</td>
                  <td className="px-4 py-2.5 tabular-nums">{Number.isFinite(inputs[f.key]) ? inputs[f.key] : "—"}</td>
                  <td className="px-4 py-2.5 text-black/60 dark:text-white/60">{f.unit}</td>
                  <td className={`px-4 py-2.5 ${f.source.startsWith("Placeholder") ? "text-amber-700 dark:text-amber-300" : "text-black/60 dark:text-white/60"}`}>
                    {f.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-black/50 dark:text-white/45">
          None of these numbers has been validated with real students or vendors yet.
        </p>
      </section>

      {/* Logic checks */}
      <section aria-labelledby="tests-heading" className="mb-12">
        <h2 id="tests-heading" className="mb-1 text-xl font-semibold">
          Pricing logic checks
        </h2>
        <p className="mb-4 text-sm text-black/60 dark:text-white/60">These run the calculator&apos;s own functions every time the page loads.</p>
        <ul className="space-y-3">
          {logicTests.map((t) => (
            <li key={t.name} className="rounded-lg border border-black/10 dark:border-white/10 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{t.name}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    t.pass ? "bg-green-700/10 text-green-700 dark:text-green-400" : "bg-red-500/15 text-red-700 dark:text-red-300"
                  }`}
                >
                  {t.pass ? "PASS" : "FAIL"}
                </span>
              </div>
              <p className="mt-2 text-black/60 dark:text-white/60">
                <span className="text-black/50 dark:text-white/45">Expected:</span> {t.expected}
              </p>
              <p className="text-black/60 dark:text-white/60">
                <span className="text-black/50 dark:text-white/45">Actual:</span> {t.actual}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Saved */}
      <section aria-labelledby="saved-heading">
        <h2 id="saved-heading" className="mb-4 text-xl font-semibold">
          Saved scenarios
        </h2>
        {savedError ? (
          <p className="text-sm text-red-700 dark:text-red-300">{savedError}</p>
        ) : saved.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">No scenarios saved yet. Pick a scenario above and save it.</p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/10 rounded-lg border border-black/10 dark:border-white/10">
            {saved.map((s) => (
              <li key={s.id} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-black/50 dark:text-white/45">
                    {new Date(s.created_at).toLocaleString()} · {s.scenario}
                  </p>
                </div>
                <p className="tabular-nums">
                  {formatMXN(Number(s.monthly_revenue))}/mo{" "}
                  <span className="text-black/60 dark:text-white/60">({formatMXN(Number(s.annual_revenue))}/yr)</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
