"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_MESSAGE_LENGTH, PICKUP_POINTS_ARE_EXAMPLES, type ChatMessage } from "@/lib/chat";
import MessageBubble from "./MessageBubble";
import { BTN, BTN_PRIMARY } from "@/components/marketing/actions";

type Props = {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onThumb: (id: number, thumb: "up" | "down") => void;
  onRestart: () => void;
  showPointsNote: boolean;
};

export default function ChatWindow({ messages, onSend, onThumb, onRestart, showPointsNote }: Props) {
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLOListElement>(null);
  const last = messages[messages.length - 1];
  const chips = last?.role === "bot" ? (last.chips ?? []) : [];

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setDraft("");
  }

  return (
    <div className="flex flex-col rounded-xl border border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-2.5 dark:border-white/10">
        <p className="text-sm font-semibold">
          IBERO<span className="text-red-600">GO</span> order helper
          <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/50">
            Simulated · rule-based
          </span>
        </p>
        <button type="button" onClick={onRestart} className={BTN}>
          Start over
        </button>
      </div>

      <ol ref={listRef} aria-live="polite" className="h-[26rem] space-y-3 overflow-y-auto px-4 py-4" data-testid="chat-thread">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onThumb={onThumb} />
        ))}
      </ol>

      <div className="border-t border-black/10 px-4 py-3 dark:border-white/10">
        {chips.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => send(c)}
                className={c === "Confirm" ? BTN_PRIMARY : BTN}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        {showPointsNote && PICKUP_POINTS_ARE_EXAMPLES && (
          <p className="mb-2 text-xs text-black/50 dark:text-white/40">Example pickup points (not final).</p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex gap-2"
        >
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <input
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH + 100}
            placeholder="Type a message…"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
          <button type="submit" disabled={!draft.trim()} className={BTN_PRIMARY}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
