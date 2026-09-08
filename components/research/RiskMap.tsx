import { Fragment } from "react";
import { RISKS, type Risk } from "@/lib/research";

const LEVELS: Risk["likelihood"][] = ["Low", "Medium", "High"];

const CELL_SHADE: Record<string, string> = {
  "High-High": "bg-red-600/15 border-red-600/40",
  "High-Medium": "bg-red-600/10 border-red-600/25",
  "Medium-High": "bg-red-600/10 border-red-600/25",
  "Medium-Medium": "bg-amber-500/10 border-amber-500/30",
  "High-Low": "bg-amber-500/10 border-amber-500/30",
  "Low-High": "bg-amber-500/10 border-amber-500/30",
  "Medium-Low": "bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10",
  "Low-Medium": "bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10",
  "Low-Low": "bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10",
};

export default function RiskMap() {
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 text-xs">
        <div />
        {LEVELS.map((l) => (
          <div key={l} className="text-center font-semibold text-black/50 dark:text-white/40">
            Impact: {l}
          </div>
        ))}

        {LEVELS.slice().reverse().map((rowLikelihood) => (
          <Fragment key={rowLikelihood}>
            <div className="flex items-center justify-end pr-2 font-semibold text-black/50 dark:text-white/40">
              Likelihood: {rowLikelihood}
            </div>
            {LEVELS.map((colImpact) => {
              const cellRisks = RISKS.filter(
                (r) => r.likelihood === rowLikelihood && r.impact === colImpact
              );
              const shade =
                CELL_SHADE[`${rowLikelihood}-${colImpact}`] ??
                "bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10";
              return (
                <div
                  key={`${rowLikelihood}-${colImpact}`}
                  className={`min-h-[64px] rounded-md border p-2 ${shade}`}
                >
                  {cellRisks.map((r) => (
                    <div key={r.id} className="mb-1 text-[11px] font-medium leading-snug last:mb-0">
                      {r.name}
                    </div>
                  ))}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>

      <ul className="mt-5 space-y-2 text-sm">
        {RISKS.map((r) => (
          <li key={r.id} className="border-l-2 border-black/10 pl-3 dark:border-white/10">
            <span className="font-medium">{r.name}</span>{" "}
            <span className="text-xs text-black/40 dark:text-white/30">
              (Likelihood: {r.likelihood} · Impact: {r.impact})
            </span>
            <p className="text-black/60 dark:text-white/50">{r.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
