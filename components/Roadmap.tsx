type Milestone = {
  week: string;
  title: string;
  status: "done" | "current" | "planned";
};

const milestones: Milestone[] = [
  { week: "Week 0", title: "Builder infrastructure: repo, deploy pipeline, Supabase connection", status: "done" },
  { week: "Week 1", title: "Generative Core Agent: /core turns a free-text order into structured data", status: "done" },
  { week: "Week 2", title: "Research + Benchmarking: /research proves the problem is real, tracks competitors and risk", status: "done" },
  { week: "Week 3", title: "Product + Pricing: /product maps features to tiers, /pricing simulates revenue from students and vendors", status: "done" },
  { week: "Week 4+", title: "Next course module — scope announced week by week", status: "planned" },
];

const DOT_CLASS: Record<Milestone["status"], string> = {
  done: "bg-black/40 dark:bg-white/40",
  current: "bg-red-600",
  planned: "bg-black/20 dark:bg-white/20",
};

const BADGE_CLASS: Record<Milestone["status"], string> = {
  done: "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/50",
  current: "bg-red-600/10 text-red-700 dark:text-red-400",
  planned: "bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/40",
};

const BADGE_LABEL: Record<Milestone["status"], string> = {
  done: "Done",
  current: "In progress",
  planned: "Planned",
};

export default function Roadmap() {
  return (
    <section className="mx-auto mt-16 max-w-2xl px-4 sm:px-6">
      <h2 className="mb-6 text-xl font-semibold">Roadmap</h2>
      <ol className="relative border-l border-black/10 pl-6 dark:border-white/10">
        {milestones.map((m) => (
          <li key={m.week} className="mb-8 last:mb-0">
            <span className={`absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full ${DOT_CLASS[m.status]}`} />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">
                {m.week}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_CLASS[m.status]}`}>
                {BADGE_LABEL[m.status]}
              </span>
            </div>
            <p
              className={
                m.status === "planned"
                  ? "mt-1 text-black/50 dark:text-white/40"
                  : "mt-1 text-black/80 dark:text-white/80"
              }
            >
              {m.title}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
