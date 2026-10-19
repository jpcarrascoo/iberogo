"use client";

import { useCallback, useEffect, useState } from "react";
import { AB_TESTS, MIN_VOTES, abSummary, type ABTest, type Choice } from "@/lib/marketing";
import { fetchVotes, recordVote, type Vote } from "@/lib/supabaseMarketing";
import { BTN_PRIMARY } from "./actions";

function TestCard({ test, votes, onVoted }: { test: ABTest; votes: Vote[]; onVoted: () => void }) {
  const [picked, setPicked] = useState<Choice | null>(null);
  const [reason, setReason] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const mine = votes.filter((v) => v.test_id === test.id);
  const s = abSummary(mine);
  const reasons = mine.filter((v) => v.reason).slice(0, 4);

  async function submit() {
    if (!picked) return;
    setState("saving");
    const err = await recordVote({ test_id: test.id, choice: picked, variant_text: test.variants[picked].es, reason });
    if (err) {
      setError(err);
      setState("error");
      return;
    }
    setState("saved");
    setPicked(null);
    setReason("");
    onVoted();
  }

  const verdict =
    s.total === 0
      ? "No votes yet — run this test with real IBERO students."
      : s.decided
        ? `Winner so far: ${s.leader} (${s.leader === "A" ? s.aPct : s.bPct}% of ${s.total} votes).`
        : s.total < MIN_VOTES
          ? `Not enough data: ${s.total} of ${MIN_VOTES} minimum votes.`
          : "Tied — no decision. Get more votes.";

  return (
    <article className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">{test.name}</h3>
        <p className="text-xs text-black/50 dark:text-white/40">Used in: {test.where}</p>
      </div>
      <p className="mt-1 text-sm text-black/60 dark:text-white/50">Ask: {test.question}</p>

      <fieldset className="mt-3">
        <legend className="sr-only">Which variant did the student pick?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["A", "B"] as Choice[]).map((c) => (
            <label
              key={c}
              className={`cursor-pointer rounded-lg border-2 p-4 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-red-600 ${
                picked === c ? "border-red-600 bg-red-600/5" : "border-black/10 hover:border-red-600/40 dark:border-white/15"
              }`}
            >
              <input type="radio" name={test.id} value={c} checked={picked === c} onChange={() => setPicked(c)} className="sr-only" />
              <span className="text-xs font-semibold text-black/50 dark:text-white/40">Variant {c}</span>
              <span className="mt-1 block text-lg font-bold leading-snug">{test.variants[c].es}</span>
              <span className="block text-sm text-black/55 dark:text-white/45">{test.variants[c].en}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why did they pick it? (optional, their words)"
          maxLength={200}
          className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-1.5 text-sm dark:border-white/20"
        />
        <button type="button" onClick={submit} disabled={!picked || state === "saving"} className={BTN_PRIMARY}>
          {state === "saving" ? "Saving…" : "Record vote"}
        </button>
      </div>
      {state === "saved" && <p className="mt-2 text-sm text-green-700 dark:text-green-400">Vote saved ✓</p>}
      {state === "error" && <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>}

      <div className="mt-4 border-t border-black/10 pt-3 dark:border-white/10" aria-live="polite">
        <div className="flex h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10" aria-hidden="true">
          {s.total > 0 && (
            <>
              <div className="bg-red-600" style={{ width: `${s.aPct}%` }} />
              <div className="bg-neutral-500" style={{ width: `${s.bPct}%` }} />
            </>
          )}
        </div>
        <p className="mt-2 text-sm tabular-nums">
          <span className="font-semibold text-red-700 dark:text-red-400">A {s.a}</span> ({s.aPct}%) ·{" "}
          <span className="font-semibold">B {s.b}</span> ({s.bPct}%) · {s.total} total
        </p>
        <p className="text-sm text-black/60 dark:text-white/50">{verdict}</p>
        {reasons.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-black/60 dark:text-white/50">
            {reasons.map((r) => (
              <li key={r.id}>
                <strong>{r.choice}:</strong> “{r.reason}”
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-black/45 dark:text-white/35">Hypothesis: {test.hypothesis}</p>
      </div>
    </article>
  );
}

export default function ABTester() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { rows, error } = await fetchVotes();
    setVotes(rows);
    setError(error);
  }, []);

  useEffect(() => {
    let active = true;
    fetchVotes().then(({ rows, error }) => {
      if (!active) return;
      setVotes(rows);
      setError(error);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-black/60 dark:text-white/50">
        How to run it: show one student both variants on your phone, ask the question, tap their pick, add their reason, record. One
        vote per student per test, at least {MIN_VOTES} students per test. Only real votes go here — nothing is pre-filled.
      </p>
      {error && <p className="text-sm text-red-700 dark:text-red-400">{error}</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        {AB_TESTS.map((t) => (
          <TestCard key={t.id} test={t} votes={votes} onVoted={load} />
        ))}
      </div>
    </div>
  );
}
