type Milestone = {
  week: string;
  title: string;
  status: "current" | "planned";
};

const milestones: Milestone[] = [
  { week: "Week 0", title: "Builder infrastructure: repo, deploy pipeline, Supabase connection", status: "current" },
  { week: "Week 1", title: "Browse IBERO restaurants & cafeterias and their menus", status: "planned" },
  { week: "Week 2", title: "Add items to a cart and choose a pickup time", status: "planned" },
  { week: "Week 3", title: "Order confirmation with order number + restaurant staff order view", status: "planned" },
];

export default function Roadmap() {
  return (
    <section className="mx-auto mt-16 max-w-2xl px-4 sm:px-6">
      <h2 className="mb-6 text-xl font-semibold">Roadmap</h2>
      <ol className="relative border-l border-black/10 pl-6 dark:border-white/10">
        {milestones.map((m) => (
          <li key={m.week} className="mb-8 last:mb-0">
            <span
              className={
                "absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full " +
                (m.status === "current"
                  ? "bg-red-600"
                  : "bg-black/20 dark:bg-white/20")
              }
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">
                {m.week}
              </span>
              {m.status === "current" ? (
                <span className="rounded-full bg-red-600/10 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                  In progress
                </span>
              ) : (
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-black/50 dark:bg-white/10 dark:text-white/40">
                  Planned
                </span>
              )}
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
