// Placeholders on purpose: these are filled in by hand only after real people test /chat.
// Never simulated (course rule).

export type ExternalTest = { tester: string; date: string | null; observation: string | null; fix: string | null };

export const EXTERNAL_TESTS: ExternalTest[] = [
  { tester: "Tester 1", date: null, observation: null, fix: null },
  { tester: "Tester 2", date: null, observation: null, fix: null },
  { tester: "Tester 3", date: null, observation: null, fix: null },
];

export default function ExternalTests() {
  return (
    <div>
      <p className="mb-3 text-sm text-black/60 dark:text-white/50">
        3 real people use this page on their own phone with one instruction: &ldquo;Set up a pickup order and ask it anything you want to
        know.&rdquo; Each saves their session as Tester 1, 2 or 3 above. Nothing here is simulated.
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
