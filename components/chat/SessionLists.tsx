"use client";

import { useEffect, useState } from "react";
import { GUARDRAIL_LABELS } from "@/lib/chat";
import { fetchSessions, type SavedSession } from "@/lib/supabaseChat";

const OUTCOME_CLASS: Record<SavedSession["outcome"], string> = {
  confirmed: "bg-green-700/10 text-green-800 dark:text-green-400",
  handoff: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  incomplete: "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/50",
};

function useSessions(refreshKey: number, handoffOnly: boolean) {
  const [rows, setRows] = useState<SavedSession[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    fetchSessions({ handoffOnly, limit: 8 }).then((r) => {
      if (cancelled) return;
      setRows(r.rows);
      setError(r.error);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshKey, handoffOnly]);
  return { rows, error };
}

const when = (iso: string) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export function RecentSessions({ refreshKey }: { refreshKey: number }) {
  const { rows, error } = useSessions(refreshKey, false);
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (rows === null) return <p className="text-sm text-black/50 dark:text-white/40">Loading…</p>;
  if (rows.length === 0) return <p className="text-sm text-black/50 dark:text-white/40">No test sessions saved yet.</p>;
  return (
    <ul className="space-y-2" data-testid="recent-sessions">
      {rows.map((s) => (
        <li key={s.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${OUTCOME_CLASS[s.outcome]}`}>{s.outcome}</span>
            <span className="font-medium">{s.tester_label ?? "Unlabeled"}</span>
            <span className="text-black/50 dark:text-white/40">· {when(s.created_at)}</span>
          </div>
          <p className="mt-1 text-black/70 dark:text-white/60">
            Rating {s.rating ? `${s.rating}/5` : "—"} · 👍 {s.thumbs_up} · 👎 {s.thumbs_down} · {s.transcript.length} messages
            {s.guardrails.length > 0 && ` · Guardrails: ${s.guardrails.map((g) => GUARDRAIL_LABELS[g] ?? g).join(", ")}`}
          </p>
          {s.comment && <p className="mt-1 italic text-black/60 dark:text-white/50">“{s.comment}”</p>}
          <details className="mt-1">
            <summary className="cursor-pointer text-xs text-black/50 dark:text-white/40">Transcript (redacted)</summary>
            <ol className="mt-1 space-y-0.5 text-xs">
              {s.transcript.map((m, i) => (
                <li key={i}>
                  <strong>{m.role === "bot" ? "Assistant" : "Student"}:</strong> {m.text}
                  {m.thumb && ` ${m.thumb === "up" ? "👍" : "👎"}`}
                </li>
              ))}
            </ol>
          </details>
        </li>
      ))}
    </ul>
  );
}

export function HandoffList({ refreshKey }: { refreshKey: number }) {
  const { rows, error } = useSessions(refreshKey, true);
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (rows === null) return <p className="text-sm text-black/50 dark:text-white/40">Loading…</p>;
  if (rows.length === 0) return <p className="text-sm text-black/50 dark:text-white/40">Nothing waiting for a person.</p>;
  return (
    <ul className="space-y-2" data-testid="handoff-list">
      {rows.map((s) => (
        <li key={s.id} className="rounded-lg border border-amber-500/40 p-3 text-sm">
          <p className="font-medium">{s.handoff_reason ?? "Flagged"}</p>
          <p className="text-black/60 dark:text-white/50">
            {s.tester_label ?? "Unlabeled"} · {when(s.created_at)}
          </p>
        </li>
      ))}
    </ul>
  );
}
