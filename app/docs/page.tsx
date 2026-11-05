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

      <section className="mt-6 rounded-lg border border-black/10 p-5 dark:border-white/10">
        <h2 className="text-lg font-semibold">
          Prompt library — Week 4: Marketing Engine + Content System
        </h2>
        <p className="mt-2 text-sm text-black/70 dark:text-white/60">
          The <code>/marketing</code> content (brand system, persona, landing
          copy, 10 posts, 3 video scripts, 14-day calendar) was{" "}
          <strong>drafted with an AI coding assistant</strong> and is stored
          as fixed data in <code>lib/brand.ts</code> and{" "}
          <code>lib/marketing.ts</code>. There is no live AI call and nothing
          posts automatically — free tools only.
        </p>

        <h3 className="mt-4 text-sm font-semibold">What the drafts were given</h3>
        <ul className="mt-1 list-inside list-disc text-sm text-black/70 dark:text-white/60">
          <li>The Week 1 value proposition (the three alternatives students already try).</li>
          <li>The Week 2 research, including the Coco finding.</li>
          <li>The Week 3 tiers and prices.</li>
          <li>
            Two real student conversations (Sept 14 and Sept 28, 2026). Both
            said the same two things matter: ordering the way you&apos;d text a
            friend, and choosing your own pickup time and place.
          </li>
        </ul>

        <h3 className="mt-4 text-sm font-semibold">Rules the drafts must follow</h3>
        <ul className="mt-1 list-inside list-disc text-sm text-black/70 dark:text-white/60">
          <li>Spanish-first in Week 4; switched to English by default in Week 5 after instructor feedback (Spanish stays an optional toggle).</li>
          <li>No invented numbers or testimonials; real quotes are paraphrased, dated and anonymous.</li>
          <li>No launch claims (&quot;order now&quot;, &quot;available now&quot;) while ordering isn&apos;t live — logic check 11 enforces this.</li>
          <li>
            The <code>/core</code> demo only understands English orders, so
            every demo example in the copy is English — logic check 12 runs
            that exact example through the real parser.
          </li>
          <li>Never imply IBEROGO is official Universidad Iberoamericana.</li>
        </ul>

        <h3 className="mt-4 text-sm font-semibold">How the message gets chosen</h3>
        <p className="mt-1 text-sm text-black/70 dark:text-white/60">
          Two A/B tests are run in person with real IBERO students (at least 5
          per test), and votes are saved to Supabase (<code>ab_votes</code>).
          The Test 1 winner becomes the homepage headline by changing{" "}
          <code>HOMEPAGE_HEADLINE</code> in <code>lib/marketing.ts</code>.
          The tests were run in Spanish; since Week 5 the homepage shows the
          English translation of the winner.
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-black/10 p-5 dark:border-white/10">
        <h2 className="text-lg font-semibold">Prompt library — Week 5: Guided assistant (/chat)</h2>
        <p className="mt-2 text-sm text-black/70 dark:text-white/60">
          The <code>/chat</code> assistant is a <strong>simulated, rule-based state machine</strong>{" "}
          (<code>lib/chat.ts</code>), not an AI API call. The page says so at the top. Free tools only.
        </p>

        <h3 className="mt-4 text-sm font-semibold">Order of checks for every message</h3>
        <ol className="mt-1 list-inside list-decimal text-sm text-black/70 dark:text-white/60">
          <li>
            <strong>Guardrails</strong>: too long, payment data, personal data, allergy, abusive language, &quot;is my order
            real?&quot;, &quot;talk to a human&quot;, off-topic.
          </li>
          <li>
            <strong>Intake</strong>: what (parsed by the Week 1 parser) → when (skipped with a confirmation if the order
            already had a time) → where → summary.
          </li>
          <li>
            <strong>FAQ</strong>: questions are answered from the same data the homepage and <code>/pricing</code> use, so they
            can&apos;t contradict each other.
          </li>
          <li>
            <strong>Fallback</strong>: &quot;I&apos;m not sure&quot;; two in a row flags the chat for a person.
          </li>
        </ol>

        <h3 className="mt-4 text-sm font-semibold">Human checkpoint</h3>
        <ul className="mt-1 list-inside list-disc text-sm text-black/70 dark:text-white/60">
          <li>Nothing counts as an order request until the student presses <strong>Confirm</strong> on the summary.</li>
          <li>
            Allergies, complaints, &quot;talk to a human&quot; and repeated unknowns set the outcome to{" "}
            <strong>handoff</strong>. Those sessions appear under &quot;Needs human review&quot;. The assistant never
            promises allergen safety.
          </li>
        </ul>

        <h3 className="mt-4 text-sm font-semibold">Storage and privacy</h3>
        <p className="mt-1 text-sm text-black/70 dark:text-white/60">
          &quot;Save test summary&quot; writes one row to <code>chat_sessions</code> (outcome, redacted transcript, guardrails,
          👍/👎 counts, 1–5 rating, comment). Card numbers, emails and phone numbers are replaced with placeholders in
          the browser before anything is saved or shown.
        </p>
      </section>
    </div>
  );
}
