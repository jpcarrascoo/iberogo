import { BRAND, COLORS, CONTRAST_PAIRS, DONTS, DOS, FONT_NOTE, KNOWN_INCONSISTENCIES, TYPE_SCALE, VOICE, contrastRatio } from "@/lib/brand";

export default function BrandSystem() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-black/10 p-5 dark:border-white/10">
        <p className="text-3xl font-bold tracking-tight">
          {BRAND.wordmark.first}
          <span className="text-red-600">{BRAND.wordmark.accent}</span>
        </p>
        <p className="mt-2 font-medium">{BRAND.tagline.es}</p>
        <p className="text-sm text-black/60 dark:text-white/50">{BRAND.tagline.en}</p>
        <p className="mt-3 text-sm text-black/70 dark:text-white/60">{BRAND.oneLiner.es}</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Color</h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLORS.map((c) => (
            <li key={c.hex} className="flex gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10">
              <span className="h-12 w-12 shrink-0 rounded-md border border-black/10 dark:border-white/20" style={{ background: c.hex }} aria-hidden="true" />
              <div className="min-w-0 text-sm">
                <p className="font-medium">
                  {c.name} <span className="font-mono text-xs text-black/50 dark:text-white/40">{c.hex}</span>
                </p>
                <p className="text-black/60 dark:text-white/50">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Text pair</th>
                <th scope="col" className="px-3 py-2 font-medium">Contrast</th>
                <th scope="col" className="px-3 py-2 font-medium">AA (4.5:1)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {CONTRAST_PAIRS.map((p) => {
                const r = contrastRatio(p.fg, p.bg);
                return (
                  <tr key={p.label}>
                    <td className="px-3 py-2">
                      <span className="mr-2 inline-block rounded px-1.5 py-0.5 text-xs font-semibold" style={{ color: p.fg, background: p.bg, border: "1px solid rgba(128,128,128,.3)" }}>
                        Aa
                      </span>
                      {p.label}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{r}:1</td>
                    <td className="px-3 py-2">{r >= 4.5 ? "Pass" : "Fail"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Type</h3>
          <ul className="space-y-2 text-sm">
            {TYPE_SCALE.map((t) => (
              <li key={t.role} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <p className="text-black/50 dark:text-white/40">
                  {t.role} · {t.spec}
                </p>
                <p className="mt-1 font-semibold">{t.sample}</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-black/50 dark:text-white/40">{FONT_NOTE}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Voice</h3>
          <ul className="space-y-2 text-sm">
            {VOICE.map((v) => (
              <li key={v.rule} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <p className="font-medium">
                  {v.rule} <span className="font-normal text-black/50 dark:text-white/40">({v.en})</span>
                </p>
                <p className="mt-1 text-black/60 dark:text-white/50">{v.example}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <h3 className="font-semibold">Do</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black/70 dark:text-white/60">
            {DOS.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-red-600/30 p-4">
          <h3 className="font-semibold">Don&apos;t</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black/70 dark:text-white/60">
            {DONTS.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {KNOWN_INCONSISTENCIES.length > 0 && (
        <p className="text-sm text-black/60 dark:text-white/50">
          <strong>Known inconsistency:</strong> {KNOWN_INCONSISTENCIES.join(" ")}
        </p>
      )}
    </div>
  );
}
