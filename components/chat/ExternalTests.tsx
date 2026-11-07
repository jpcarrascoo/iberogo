// Filled in by hand from real external tests on Nov 6, 2026 (saved sessions Tester 1–3 on /chat).
// Never simulated (course rule).

export type ExternalTest = { tester: string; date: string | null; observation: string | null; fix: string | null };

export const EXTERNAL_TESTS: ExternalTest[] = [
  {
    tester: "Tester 1",
    date: "Nov 6, 2026 · rated 4/5",
    observation:
      "Ordered \u201c1 salad sandwich\u201d, picked 12:00 PM and Library entrance, and confirmed with no help. Comment: \u201cI really liked the way the Chat understands quickly and makes it easy to add my things into the order.\u201d",
    fix: null,
  },
  {
    tester: "Tester 2",
    date: "Nov 6, 2026 · rated 3/5",
    observation:
      "Typed the whole order in one sentence: \u201cid like to have a margherita pizza please at 1:00pm by the main cafeteria\u201d. The assistant found no items, so they had to retype \u201cmargherita pizza\u201d and answer the time and place again. Comment: \u201cIt didn't understand what I ordered, so I don't think it could work well.\u201d",
    fix: "Polite phrases (\u201cI'd like to have\u2026 please\u201d) are removed before parsing, and a pickup point written inside the order is recognized, so this exact sentence now goes straight to the summary. Logic check 17.",
  },
  {
    tester: "Tester 3",
    date: "Nov 6, 2026 · rated 5/5",
    observation:
      "Ordered \u201cchicken\u201d, picked 2:00 PM and Main cafeteria, and confirmed. Comment: \u201cEasy, and very good understanding 10/10.\u201d",
    fix: null,
  },
];

export default function ExternalTests() {
  return (
    <div>
      <p className="mb-3 text-sm text-black/60 dark:text-white/50">
        3 real people used this page with one instruction: &ldquo;Set up a pickup order and ask it anything you want to
        know.&rdquo; Each saved their session as Tester 1, 2 or 3 (see Recent test sessions). Nothing here is simulated.
      </p>
      <p className="mb-3 text-sm text-black/60 dark:text-white/50">
        Across all 3: every order reached Confirm (average rating 4/5), but nobody asked the assistant a question and nobody used
        👍/👎. Both are notes for next week.
      </p>
      <ul className="grid gap-3 md:grid-cols-3">
        {EXTERNAL_TESTS.map((t) => (
          <li key={t.tester} className="rounded-lg border border-dashed border-black/20 p-3 text-sm dark:border-white/20">
            <p className="font-semibold">{t.tester}</p>
            {t.observation ? (
              <>
                <p className="text-black/50 dark:text-white/40">{t.date}</p>
                <p className="mt-1">{t.observation}</p>
                {t.fix && <p className="mt-1 text-green-800 dark:text-green-400">Fix: {t.fix}</p>}
              </>
            ) : (
              <p className="mt-1 text-black/50 dark:text-white/40">Placeholder · not tested yet</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
