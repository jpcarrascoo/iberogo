"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TABLES } from "@/lib/site";
import { fetchTable, TABLE_VIEWS, type Row } from "@/lib/supabaseDashboard";
import { runChatChecks } from "@/lib/chat";
import { runDemoChecks } from "@/lib/demo";
import { runLogicTests } from "@/lib/pricing";
import { runMarketingChecks } from "@/lib/marketing";
import { REGRESSION, REGRESSION_ALSO_CHECKED, REGRESSION_DATE } from "@/lib/regression";
import { HandoffList } from "@/components/chat/SessionLists";
import { ImpactCheck, TestingSummaryPanel, useDemoData } from "@/components/demo/Results";
import ChecksList from "@/components/ChecksList";
import Section from "@/components/Section";
import { BTN } from "@/components/marketing/actions";

const when = (iso: string) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

type TableState = { count: number | null; rows: Row[]; error: string } | null;

function TableCard({ name, week, label, href, refreshKey }: { name: string; week: string; label: string; href: string; refreshKey: number }) {
  const [t, setT] = useState<TableState>(null);
  useEffect(() => {
    let cancelled = false;
    fetchTable(name).then((r) => {
      if (!cancelled) setT(r);
    });
    return () => {
      cancelled = true;
    };
  }, [name, refreshKey]);
  return (
    <li className="flex flex-col rounded-lg border border-black/10 p-3 text-sm dark:border-white/10" data-testid={`table-${name}`}>
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/35">{week}</p>
          <Link href={href} className="font-semibold hover:text-red-600">
            {label}
          </Link>
          <p>
            <code className="text-xs text-black/50 dark:text-white/40">{name}</code>
          </p>
        </div>
        <p className="text-2xl font-bold" data-testid={`count-${name}`}>
          {t === null ? "…" : t.count === null ? "—" : t.count}
        </p>
      </div>
      {t?.error ? (
        <p className="mt-2 text-red-600">{t.error}</p>
      ) : t && t.rows.length === 0 ? (
        <p className="mt-2 text-black/50 dark:text-white/40">No records yet.</p>
      ) : (
        <ul className="mt-2 space-y-1 border-t border-black/10 pt-2 dark:border-white/10">
          {(t?.rows ?? []).map((r) => (
            <li key={r.id} className="break-words text-black/70 dark:text-white/60">
              <span className="text-xs text-black/40 dark:text-white/35">{when(r.created_at)} · </span>
              {TABLE_VIEWS[name].line(r)}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SiteHealth() {
  const suites = useMemo(
    () => [
      { name: "Pricing logic (/pricing, Week 3)", checks: runLogicTests() },
      { name: "Marketing checks (/marketing, Week 4)", checks: runMarketingChecks() },
      { name: "Chat logic checks (/chat, Week 5 + 6)", checks: runChatChecks() },
      { name: "Demo logic checks (/demo, Week 6)", checks: runDemoChecks() },
    ],
    []
  );
  const total = suites.reduce((n, s) => n + s.checks.length, 0);
  const passed = suites.reduce((n, s) => n + s.checks.filter((c) => c.pass).length, 0);
  return (
    <div>
      <p className="mb-3 text-sm">
        <strong data-testid="site-health-summary">
          {passed} of {total} checks passing across {suites.length} suites.
        </strong>
      </p>
      <ul className="space-y-2">
        {suites.map((s) => {
          const ok = s.checks.filter((c) => c.pass).length;
          return (
            <li key={s.name} className="rounded-lg border border-black/10 dark:border-white/10">
              <details>
                <summary className="flex cursor-pointer items-center justify-between gap-3 p-3 text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      ok === s.checks.length ? "bg-green-700/10 text-green-800 dark:text-green-400" : "bg-red-600/15 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {ok === s.checks.length ? "PASS" : "FAIL"} · {ok}/{s.checks.length}
                  </span>
                </summary>
                <div className="border-t border-black/10 p-3 dark:border-white/10">
                  <ChecksList checks={s.checks} />
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RegressionTable() {
  return (
    <div>
      <p className="mb-3 text-sm text-black/60 dark:text-white/50">
        Run by hand on the production URL{REGRESSION_DATE ? ` on ${REGRESSION_DATE}` : ""}. For every page:{" "}
        {REGRESSION_ALSO_CHECKED.join("; ").toLowerCase()}; plus its main action below.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm" data-testid="regression-table">
          <thead className="text-xs uppercase tracking-wide text-black/50 dark:text-white/40">
            <tr>
              <th className="py-2 pr-3 font-semibold">Page</th>
              <th className="py-2 pr-3 font-semibold">Main action</th>
              <th className="py-2 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody>
            {REGRESSION.map((r) => (
              <tr key={r.route} className="border-t border-black/10 align-top dark:border-white/10">
                <td className="py-2 pr-3">
                  <Link href={r.route} className="font-medium hover:text-red-600">
                    {r.route}
                  </Link>
                </td>
                <td className="py-2 pr-3 text-black/70 dark:text-white/60">
                  {r.mainAction}
                  {r.note && <span className="block text-xs text-black/50 dark:text-white/40">{r.note}</span>}
                </td>
                <td className="py-2 whitespace-nowrap">
                  {r.result === null ? (
                    <span className="text-black/50 dark:text-white/40">Not run yet</span>
                  ) : (
                    <span className={r.result === "PASS" ? "font-semibold text-green-700 dark:text-green-400" : "font-semibold text-red-600"}>{r.result}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const data = useDemoData(refreshKey);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Week 6 · Builder view</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-black/70 dark:text-white/60">
            Every record IBEROGO has saved, in one place: read-only, newest first. Plus the hand-off queue, the real test results and the
            health of every logic check.
          </p>
        </div>
        <button type="button" onClick={() => setRefreshKey((k) => k + 1)} className={BTN}>
          Refresh
        </button>
      </header>

      <div className="space-y-10">
        <Section id="records" title="Records" zone="Saved" intro="Count and the 5 newest rows of each Supabase table.">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TABLES.map((t) => (
              <TableCard key={t.name} {...t} refreshKey={refreshKey} />
            ))}
          </ul>
        </Section>

        <Section id="handoff" title="Needs human review" zone="Saved" intro="Chats flagged by the assistant: allergies, complaints, asked for a person, or 2 unanswered messages.">
          <HandoffList refreshKey={refreshKey} />
        </Section>

        <Section id="testing" title="Testing summary" zone="Testing" intro="External testers only: /demo runs saved as Tester 1…5. Target: 5 testers, each asking a question, testing a limit and rating a reply.">
          <TestingSummaryPanel data={data} />
        </Section>

        <Section id="impact" title="Practical impact check" zone="Testing">
          <ImpactCheck data={data} />
        </Section>

        <Section id="health" title="Site health" zone="Testing" intro="The automatic half of the full-site regression test: every logic-check suite on the site, run in your browser now.">
          <SiteHealth />
        </Section>

        <Section id="regression" title="Full-site regression test" zone="Testing">
          <RegressionTable />
        </Section>
      </div>
    </div>
  );
}
