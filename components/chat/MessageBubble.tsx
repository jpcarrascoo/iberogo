import type { ChatMessage } from "@/lib/chat";
import { GUARDRAIL_LABELS } from "@/lib/chat";
import SummaryCard from "./SummaryCard";

type Props = {
  message: ChatMessage;
  onThumb: (id: number, thumb: "up" | "down") => void;
};

export default function MessageBubble({ message, onThumb }: Props) {
  if (message.role === "student") {
    return (
      <li className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-red-600 px-3.5 py-2 text-sm whitespace-pre-wrap text-white">{message.text}</p>
      </li>
    );
  }
  // Week 6: 👍/👎 were easy to miss in Week 5 testing (no tester used them), so they now
  // have a visible label and a border instead of faded icons.
  const thumbBtn = (t: "up" | "down") =>
    `rounded-md border px-2 py-0.5 text-sm transition ${
      message.thumb === t
        ? "border-red-600/50 bg-red-600/10"
        : "border-black/15 opacity-80 hover:opacity-100 dark:border-white/20"
    }`;
  return (
    <li className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="rounded-2xl rounded-bl-sm bg-black/5 px-3.5 py-2 text-sm whitespace-pre-wrap dark:bg-white/10">
          {message.guardrail && (
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Guardrail · {GUARDRAIL_LABELS[message.guardrail]}
            </span>
          )}
          {message.text}
          {message.summary && <SummaryCard summary={message.summary} />}
        </div>
        <div className="mt-1 flex items-center gap-1.5 pl-1" role="group" aria-label="Rate this reply">
          <span className="text-xs text-black/50 dark:text-white/45">Was this helpful?</span>
          <button type="button" aria-label="Helpful" aria-pressed={message.thumb === "up"} onClick={() => onThumb(message.id, "up")} className={thumbBtn("up")}>
            👍
          </button>
          <button type="button" aria-label="Not helpful" aria-pressed={message.thumb === "down"} onClick={() => onThumb(message.id, "down")} className={thumbBtn("down")}>
            👎
          </button>
        </div>
      </div>
    </li>
  );
}
