import { PERSONA } from "@/lib/marketing";

export default function PersonaCard() {
  const p = PERSONA;
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
      <div className="rounded-lg border border-black/10 p-5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white" aria-hidden="true">
            {p.name[0]}
          </span>
          <div>
            <p className="text-lg font-semibold">{p.name}</p>
            <p className="text-sm text-black/60 dark:text-white/50">{p.age}</p>
          </div>
        </div>
        <span className="mt-3 inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/50">
          {p.label}
        </span>
        <p className="mt-3 text-sm">{p.context.es}</p>
        <p className="text-sm text-black/60 dark:text-white/50">{p.context.en}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Goals</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {p.goals.map((g) => (
                <li key={g.es}>
                  {g.es} <span className="text-black/50 dark:text-white/40">({g.en})</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Frustrations</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              {p.frustrations.map((f) => (
                <li key={f.es}>
                  {f.es} <span className="text-black/50 dark:text-white/40">({f.en})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm">
          <strong>Where to reach her:</strong> {p.channels.join(" · ")}
        </p>
        <p className="mt-2 text-sm">
          <strong>Would pay:</strong> {p.wouldPay.es}{" "}
          <span className="text-black/50 dark:text-white/40">({p.wouldPay.en})</span>
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
        <h3 className="text-sm font-semibold">Built from two real conversations</h3>
        <ul className="mt-3 space-y-4 text-sm">
          {p.basedOn.map((b) => (
            <li key={b.date}>
              <p className="text-black/50 dark:text-white/40">
                {b.date} · {b.who} · paraphrased
              </p>
              <p className="mt-1 text-black/80 dark:text-white/70">{b.paraphrase}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-black/50 dark:text-white/40">
          Two conversations aren&apos;t validation. Sofía is a working hypothesis to write for, not a real person.
        </p>
      </div>
    </div>
  );
}
