import type { ReactNode } from "react";

export type Zone = "Input" | "Output" | "Input + output" | "Saved" | "Testing";

const ZONE_CLASS: Record<Zone, string> = {
  Input: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  Output: "bg-red-600/10 text-red-700 dark:text-red-400",
  "Input + output": "bg-red-600/10 text-red-700 dark:text-red-400",
  Saved: "bg-green-700/10 text-green-800 dark:text-green-400",
  Testing: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
};

/** Page section with the course's four mockup zones shown as a small label. */
export default function Section({
  id,
  title,
  zone,
  intro,
  children,
}: {
  id: string;
  title: string;
  zone: Zone;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-black/10 pt-8 dark:border-white/10">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 id={`${id}-h`} className="text-xl font-semibold">
          {title}
        </h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${ZONE_CLASS[zone]}`}>{zone}</span>
      </div>
      {intro && <p className="mb-4 max-w-2xl text-sm text-black/60 dark:text-white/50">{intro}</p>}
      {children}
    </section>
  );
}
