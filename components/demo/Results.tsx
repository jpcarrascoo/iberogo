"use client";

import { useEffect, useState } from "react";
import { CHECKLIST_ITEMS, isExternalTester, testingSummary, type SavedDemoRun } from "@/lib/demo";
import { HARM_CHECKLIST, harmExercised } from "@/lib/impact";
import { fetchDemoChatGuardrails, fetchDemoRuns } from "@/lib/supabaseDemo";

type DemoData = { runs: SavedDemoRun[]; demoChats: { guardrails: string[] | null }[]; error: string } | null;

/** Loads real /demo runs and the guardrails from /demo chats. Re-runs when refreshKey changes. */
export function useDemoData(refreshKey: number): DemoData {
  const [data, setData] = useState<DemoData>(null);
  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchDemoRuns(), fetchDemoChatGuardrails()]).then(([runs, chats]) => {
      if (cancelled) return;
      // Only chats from external testers count as "hit by a real tester" (not the builder's software tests).
      setData({ runs: runs.rows, demoChats: chats.rows.filter((c) => isExternalTester(c.tester_label)), error: runs.error || chats.error });
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);
  return data;
}

function Stat({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <div className="rounded-md bg-black/5 p-2 dark:bg-white/10">
      <dt className="text-xs text-black/50 dark:text-white/40">{label}</dt>
      <dd className="font-semibold" data-testid={testId}>
        {value}
      </dd>
    </div>
  );
}

/** External testers only (labels "Tester 1"…"Tester 5"). Never shows a number that isn't in the database. */
export function TestingSummaryPanel({ data }: { data: DemoData }) {
  if (data === null) return <p className="text-sm text-black/50 dark:text-white/40">Loading…</p>;
  if (data.error) return <p className="text-sm text-red-600">{data.error}</p>;
  const s = testingSummary(data.runs);
  if (s.testers === 0)
    return (
      <p className="rounded-lg border border-dashed border-black/20 p-3 text-sm text-black/60 dark:border-white/20 dark:text-white/50" data-testid="testing-summary">
        0 of {s.target} external testers so far, not tested yet. Results appear here as real testers save their run as &ldquo;Tester 1&rdquo;…&ldquo;Tester {s.target}&rdquo;.
      </p>
    );
  return (
    <div data-testid="testing-summary">
      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <Stat label="External testers" value={`${s.testers} of ${s.target}`} testId="testers-count" />
        {CHECKLIST_ITEMS.map((i) => (
          <Stat
            key={i.key}
            label={i.label}
            value={`${s.ticked[i.key]} of ${s.testers}${s.skipped[i.key] ? ` · ${s.skipped[i.key]} skipped` : ""}`}
          />
        ))}
        <Stat label="Average usefulness" value={s.avgUsefulness === null ? "—" : `${s.avgUsefulness} / 5`} />
        <Stat label="Would use it" value={`yes ${s.wouldUse.yes} · maybe ${s.wouldUse.maybe} · no ${s.wouldUse.no}`} />
        <Stat
          label="Plan they'd pick"
          value={
            Object.entries(s.plans)
              .map(([p, n]) => `${p} ${n}`)
              .join(" · ") || "—"
          }
        />
      </dl>
    </div>
  );
}

export function ImpactCheck({ data }: { data: DemoData }) {
  const s = data && !data.error ? testingSummary(data.runs) : null;
  const exercised = data && !data.error ? harmExercised(data.demoChats) : null;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold">Value: what real testers said</h3>
        {data === null ? (
          <p className="mt-2 text-sm text-black/50 dark:text-white/40">Loading…</p>
        ) : data.error ? (
          <p className="mt-2 text-sm text-red-600">{data.error}</p>
        ) : !s || s.testers === 0 ? (
          <p className="mt-2 rounded-lg border border-dashed border-black/20 p-3 text-sm text-black/60 dark:border-white/20 dark:text-white/50">
            Not tested yet. This fills in from real /demo runs only, nothing is estimated.
          </p>
        ) : (
          <div className="mt-2 space-y-3 text-sm" data-testid="impact-value">
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Stat label="Minutes lost in line on a normal day (average)" value={s.avgMinutes === null ? "—" : `${s.avgMinutes} min`} />
              <Stat label="Would use IBEROGO" value={`${s.wouldUse.yes} yes · ${s.wouldUse.maybe} maybe · ${s.wouldUse.no} no`} />
              <Stat label="How useful (average)" value={s.avgUsefulness === null ? "—" : `${s.avgUsefulness} / 5`} />
            </dl>
            {s.missing.length > 0 && (
              <div>
                <p className="font-medium">What&apos;s missing, in their words</p>
                <ul className="mt-1 space-y-1">
                  {s.missing.map((m) => (
                    <li key={m.tester} className="text-black/70 dark:text-white/60">
                      <span className="font-medium">{m.tester}:</span> &ldquo;{m.text}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.concerns.length > 0 && (
              <div>
                <p className="font-medium">Anything unsafe or misleading?</p>
                <ul className="mt-1 space-y-1">
                  {s.concerns.map((m) => (
                    <li key={m.tester} className="text-black/70 dark:text-white/60">
                      <span className="font-medium">{m.tester}:</span> &ldquo;{m.text}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold">Harm: what could go wrong, and what IBEROGO does about it</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm" data-testid="harm-table">
            <thead className="text-xs uppercase tracking-wide text-black/50 dark:text-white/40">
              <tr>
                <th className="py-2 pr-3 font-semibold">Risk</th>
                <th className="py-2 pr-3 font-semibold">What IBEROGO does</th>
                <th className="py-2 pr-3 font-semibold">Proof</th>
                <th className="py-2 font-semibold">Hit by a real tester</th>
              </tr>
            </thead>
            <tbody>
              {HARM_CHECKLIST.map((h) => (
                <tr key={h.id} className="border-t border-black/10 align-top dark:border-white/10">
                  <td className="py-2 pr-3">{h.risk}</td>
                  <td className="py-2 pr-3 text-black/70 dark:text-white/60">{h.mitigation}</td>
                  <td className="py-2 pr-3 whitespace-nowrap text-black/60 dark:text-white/50">
                    {h.evidence.suite === "chat" ? "Chat" : "Demo"} check {h.evidence.number}
                  </td>
                  <td className="py-2 whitespace-nowrap text-black/60 dark:text-white/50">
                    {h.guardrails.length === 0
                      ? "Always on"
                      : exercised === null
                        ? "—"
                        : exercised[h.id] > 0
                          ? `Yes, ${exercised[h.id]} ${exercised[h.id] === 1 ? "chat" : "chats"}`
                          : "Not yet"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-black/50 dark:text-white/40">
          &ldquo;Hit by a real tester&rdquo; counts chats inside /demo that triggered that guardrail. The proof checks run on every page load
          (see Demo logic checks below and Site health on /dashboard).
        </p>
      </div>
    </div>
  );
}
