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
  const thumbBtn = (t: "up" | "down") =>
    `rounded px-1.5 py-0.5 text-xs transition ${
      message.thumb === t ? "bg-black/10 opacity-100 dark:bg-white/15" : "opacity-50 hover:opacity-100"
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
        <div className="mt-0.5 flex gap-1 pl-1" aria-label="Rate this reply">
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
