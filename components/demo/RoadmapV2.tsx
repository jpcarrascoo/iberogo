import { ROADMAP_V2 } from "@/lib/roadmap";

const SIZE_LABEL = { S: "Small", M: "Medium", L: "Large" } as const;

export default function RoadmapV2() {
  return (
    <ol className="space-y-3" data-testid="roadmap-v2">
      {ROADMAP_V2.map((r, i) => (
        <li key={r.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">
              {i + 1}. {r.title}
            </span>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/60 dark:bg-white/10 dark:text-white/50">{SIZE_LABEL[r.size]}</span>
          </div>
          <p className="mt-1 text-black/70 dark:text-white/60">{r.why}</p>
          <p className="mt-1 text-xs text-black/50 dark:text-white/40">Evidence: {r.source}</p>
        </li>
      ))}
    </ol>
  );
}
