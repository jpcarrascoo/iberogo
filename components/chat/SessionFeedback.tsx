"use client";

import { useState } from "react";
import { GUARDRAIL_LABELS, outcomeOf, thumbTally, type ChatMessage, type ChatState } from "@/lib/chat";
import { BTN_PRIMARY } from "@/components/marketing/actions";

type Props = {
  state: ChatState;
  messages: ChatMessage[];
  onSave: (fb: { rating: number | null; comment: string; testerLabel: string }) => Promise<string>;
};

export default function SessionFeedback({ state, messages, onSave }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [testerLabel, setTesterLabel] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const { up, down } = thumbTally(messages);
  const outcome = outcomeOf(state);
  const studentMessages = messages.filter((m) => m.role === "student").length;

  async function save() {
    setStatus("saving");
    const err = await onSave({ rating, comment, testerLabel });
    if (err) {
      setError(err);
      setStatus("error");
      return;
    }
    setStatus("saved");
    setRating(null);
    setComment("");
  }

  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
      <h3 className="font-semibold">Rate this chat and save the test</h3>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div className="rounded-md bg-black/5 p-2 dark:bg-white/10">
          <dt className="text-xs text-black/50 dark:text-white/40">Outcome</dt>
          <dd className="font-semibold" data-testid="outcome">{outcome}</dd>
        </div>
        <div className="rounded-md bg-black/5 p-2 dark:bg-white/10">
          <dt className="text-xs text-black/50 dark:text-white/40">👍 / 👎</dt>
          <dd className="font-semibold">
            {up} / {down}
          </dd>
        </div>
        <div className="col-span-2 rounded-md bg-black/5 p-2 dark:bg-white/10">
          <dt className="text-xs text-black/50 dark:text-white/40">Guardrails triggered</dt>
          <dd className="font-semibold">{state.guardrails.length ? state.guardrails.map((g) => GUARDRAIL_LABELS[g]).join(", ") : "none"}</dd>
        </div>
      </dl>
      {state.handoffReason && (
        <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">Flagged for human review: {state.handoffReason}</p>
      )}

      <fieldset className="mt-4">
        <legend className="text-sm text-black/70 dark:text-white/60">How useful was the assistant? (1 = not at all, 5 = very)</legend>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              onClick={() => {
                setRating(rating === n ? null : n);
                setStatus("idle");
              }}
              className={`text-2xl leading-none ${rating !== null && n <= rating ? "text-amber-500" : "text-black/20 dark:text-white/20"}`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr]">
        <label className="text-sm">
          <span className="text-black/70 dark:text-white/60">Tester label (optional)</span>
          <input
            value={testerLabel}
            onChange={(e) => setTesterLabel(e.target.value)}
            maxLength={40}
            placeholder="e.g. Tester 1"
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-1.5 dark:border-white/20"
          />
        </label>
        <label className="text-sm">
          <span className="text-black/70 dark:text-white/60">Comment (optional)</span>
          <input
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setStatus("idle");
            }}
            maxLength={500}
            placeholder="What was confusing? What would you change?"
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-1.5 dark:border-white/20"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={status === "saving" || status === "saved" || studentMessages === 0} className={BTN_PRIMARY}>
          {status === "saving" ? "Saving…" : "Save test summary"}
        </button>
        {status === "saved" && <span className="text-sm font-medium text-green-700 dark:text-green-400">Saved ✓ · press Start over for a new test</span>}
        {status === "error" && <span className="text-sm text-red-600">{error}</span>}
        {studentMessages === 0 && <span className="text-xs text-black/50 dark:text-white/40">Send at least one message first.</span>}
      </div>
      <p className="mt-2 text-xs text-black/50 dark:text-white/40">
        Card numbers, emails and phone numbers are removed before saving. Saved test sessions are visible on this page.
      </p>
    </div>
  );
}
