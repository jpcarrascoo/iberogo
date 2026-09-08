export default function DocsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold">Docs</h1>
      <p className="mt-2 text-black/60 dark:text-white/50">
        Full user-facing documentation (how to browse restaurants, place an
        order, and pick up food) will land as those features get built. For
        now, this page documents the logic behind this week&apos;s feature.
      </p>

      <section className="mt-10 rounded-lg border border-black/10 p-5 dark:border-white/10">
        <h2 className="text-lg font-semibold">
          Prompt library — Week 1: Order Parser core
        </h2>
        <p className="mt-2 text-sm text-black/70 dark:text-white/60">
          The <code>/core</code> page&apos;s &quot;AI&quot; is a{" "}
          <strong>simulated, rule-based parser</strong> (see{" "}
          <code>lib/parseOrder.ts</code>), not a call to a paid AI API — this
          week&apos;s constraints are free tools only, no paid APIs required.
          It is documented here the way a real prompt would be, since it
          plays the same role: turning messy free text into a fixed
          structured shape.
        </p>

        <h3 className="mt-4 text-sm font-semibold">What it&apos;s given</h3>
        <p className="mt-1 text-sm text-black/70 dark:text-white/60">
          A single free-text sentence describing a food order, e.g.{" "}
          <em>&quot;2 tacos, no onions, and a coke from Cafeteria Central,
          pickup around 1pm.&quot;</em>
        </p>

        <h3 className="mt-4 text-sm font-semibold">What it extracts</h3>
        <ul className="mt-1 list-inside list-disc text-sm text-black/70 dark:text-white/60">
          <li>A restaurant name, if the text says &quot;from X.&quot;</li>
          <li>
            A pickup time, from phrases like &quot;at 1pm,&quot; &quot;around
            12:30,&quot; or &quot;by noon.&quot; If a time has no am/pm and is
            between 1 and 7, it&apos;s assumed to mean PM (this is a
            lunch-ordering app) — a documented assumption, not a hidden one.
          </li>
          <li>
            A list of items, each with a quantity (numeral or word, e.g.
            &quot;2&quot; or &quot;two&quot;) and optional notes (phrases
            starting with &quot;no,&quot; &quot;without,&quot; or
            &quot;extra&quot; attach to the item right before them).
          </li>
          <li>
            Anything left over that reads as a full sentence rather than a
            menu item is kept as special instructions instead of being
            forced into the items list.
          </li>
        </ul>

        <h3 className="mt-4 text-sm font-semibold">What it deliberately doesn&apos;t do</h3>
        <p className="mt-1 text-sm text-black/70 dark:text-white/60">
          It doesn&apos;t call any external AI service, doesn&apos;t know a
          real menu (so it can&apos;t catch a misspelled dish name), and
          isn&apos;t perfect at splitting ambiguous sentences — it&apos;s a
          deterministic first pass, not a finished ordering system.
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-black/10 p-5 dark:border-white/10">
        <h2 className="text-lg font-semibold">
          Prompt library — Week 2: Research + Benchmarking
        </h2>
        <p className="mt-2 text-sm text-black/70 dark:text-white/60">
          The <code>/research</code> page is desk research, not a generative
          feature — every competitor in <code>lib/research.ts</code> is a
          real product found via web search, with a source link, not
          AI-invented. Nothing on this page is simulated output.
        </p>

        <h3 className="mt-4 text-sm font-semibold">What was researched</h3>
        <ul className="mt-1 list-inside list-disc text-sm text-black/70 dark:text-white/60">
          <li>
            5 global campus food pre-ordering products (Grubhub Campus
            Dining, Tapingo, Transact/GET, Jamezz, HKUST&apos;s own ordering
            system).
          </li>
          <li>
            4 Mexico-specific competitors (Coco, Infood, Jit Pickup,
            Drizline — more than the minimum, since Mexico findings ran
            ahead) plus the real substitute IBEROGO competes with today:
            students simply arriving early.
          </li>
        </ul>

        <h3 className="mt-4 text-sm font-semibold">The most important finding</h3>
        <p className="mt-1 text-sm text-black/70 dark:text-white/60">
          Coco, a Mexican campus-ordering platform, publicly lists{" "}
          <strong>Universidad Iberoamericana</strong> as a client. That
          doesn&apos;t mean IBEROGO shouldn&apos;t exist — Infood, built by
          Tec de Monterrey students in 2020, proves students keep building
          this anyway — but it means the honest next step is asking a real
          person at IBERO whether they&apos;ve seen it, not assuming the
          field is empty. See the Human Validation section on{" "}
          <code>/research</code>.
        </p>
      </section>
    </div>
  );
}
