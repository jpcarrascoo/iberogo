import Link from "next/link";
import { FAQ, GUARDRAIL_LABELS, runChatChecks } from "@/lib/chat";

export default function ChatWidget() {
  const checks = runChatChecks();
  const passed = checks.filter((c) => c.pass).length;
  return (
    <Link
      href="/chat"
      className="mt-3 block rounded-lg border border-black/10 p-4 transition hover:border-red-600/40 dark:border-white/10"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/30">Week 5 · Guided assistant</p>
      <p className="mt-1 text-sm text-black/70 dark:text-white/60">
        A rule-based order helper: <strong>3</strong> intake questions, <strong>{FAQ.length}</strong> FAQ answers,{" "}
        <strong>{Object.keys(GUARDRAIL_LABELS).length}</strong> guardrails, a confirm step and a hand-off to a person ·{" "}
        <strong>
          {passed}/{checks.length}
        </strong>{" "}
        logic checks passing
      </p>
    </Link>
  );
}
