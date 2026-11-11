import Link from "next/link";
import { AGENT_MAP, HUMAN_REVIEW, type AgentKind } from "@/lib/site";

const KIND_CLASS: Record<AgentKind, string> = {
  "Real logic": "bg-green-700/10 text-green-800 dark:text-green-400",
  "Simulated / rule-based": "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  "AI-assisted, human-reviewed": "bg-sky-500/15 text-sky-800 dark:text-sky-300",
};

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-2 text-xs text-black/50 dark:text-white/40" aria-hidden="true">
      <span className="h-4 w-px bg-black/20 dark:bg-white/20" />
      <span>{label}</span>
      <span className="text-base leading-none">↓</span>
    </div>
  );
}

/** Week 6 agent map: every "agent" in IBEROGO, what kind it is, and where its data goes. */
export default function AgentMap() {
  const tables = [...new Set(AGENT_MAP.flatMap((a) => a.writesTo))];
  return (
    <div data-testid="agent-map">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AGENT_MAP.map((a) => (
          <li key={a.id} className="flex flex-col rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/35">{a.week}</p>
            <Link href={a.href} className="mt-0.5 font-semibold hover:text-red-600">
              {a.name} <span className="font-normal text-black/40 dark:text-white/35">{a.href}</span>
            </Link>
            <span className={`mt-1 self-start rounded-full px-2 py-0.5 text-xs font-medium ${KIND_CLASS[a.kind]}`}>{a.kind}</span>
            <p className="mt-2 flex-1 text-black/70 dark:text-white/60">{a.does}</p>
            <p className="mt-2 text-xs text-black/50 dark:text-white/40">
              Saves to:{" "}
              {a.writesTo.map((t) => (
                <code key={t} className="mr-1 rounded bg-black/5 px-1 dark:bg-white/10">
                  {t}
                </code>
              ))}
            </p>
          </li>
        ))}
      </ul>

      <Arrow label="every save goes to" />
      <div className="rounded-lg border border-black/10 p-3 text-center text-sm dark:border-white/10">
        <p className="font-semibold">Supabase (Postgres)</p>
        <p className="mt-1 text-xs text-black/50 dark:text-white/40">{tables.length} tables · card numbers, emails and phones removed before saving</p>
      </div>
      <Arrow label="read on" />
      <Link href="/dashboard" className="block rounded-lg border border-black/10 p-3 text-center text-sm hover:border-red-600/40 dark:border-white/10">
        <p className="font-semibold">/dashboard</p>
        <p className="mt-1 text-xs text-black/50 dark:text-white/40">Records, testing summary, site health</p>
      </Link>
      <Arrow label="decided by" />
      <div className="rounded-lg border-2 border-red-600/40 p-3 text-center text-sm">
        <p className="font-semibold">{HUMAN_REVIEW.name}</p>
        <p className="mt-1 text-xs text-black/60 dark:text-white/50">{HUMAN_REVIEW.does}</p>
      </div>
      <p className="mt-3 text-xs text-black/50 dark:text-white/40">
        Labels: <strong>Real logic</strong> = plain formulas or code · <strong>Simulated / rule-based</strong> = fixed rules made to look
        like an AI, no AI API · <strong>AI-assisted, human-reviewed</strong> = drafted with an AI tool while building, checked by hand,
        stored as fixed data.
      </p>
    </div>
  );
}
