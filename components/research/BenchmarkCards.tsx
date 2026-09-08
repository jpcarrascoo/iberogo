import { GLOBAL_EXAMPLES } from "@/lib/research";

export default function BenchmarkCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {GLOBAL_EXAMPLES.map((c) => (
        <div
          key={c.id}
          className="rounded-lg border border-black/10 p-4 dark:border-white/10"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold">{c.name}</h3>
            <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/60 dark:bg-white/10 dark:text-white/50">
              {c.region}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-black/50 dark:text-white/40">
            {c.category}
          </p>
          <p className="mt-2 text-sm text-black/70 dark:text-white/60">
            {c.description}
          </p>
          <p className="mt-2 text-xs italic text-black/50 dark:text-white/40">
            {c.keyFact}
          </p>
          {c.source && (
            <a
              href={c.source}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-xs text-red-600 underline underline-offset-2"
            >
              Source
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
