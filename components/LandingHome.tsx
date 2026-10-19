"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DEMO_EXAMPLE, LANDING, type Lang } from "@/lib/marketing";
import { TIERS } from "@/lib/pricing";
import { parseOrderText } from "@/lib/parseOrder";

const TIER_SUMMARY_ES: Record<string, string> = {
  "Básico": "Pide en texto libre y elige tu punto y hora de recogida.",
  Plus: "Prioridad sin pagar un cargo en cada pedido.",
  "Campus Pass": "Comida que se ajusta a tu horario de clases.",
};

const T = {
  demoLabel: { es: "Así lo entiende el demo (resultado real)", en: "What the demo makes of it (real output)" },
  pickup: { es: "Recoger", en: "Pickup" },
  tiersTitle: { es: "Planes propuestos", en: "Proposed plans" },
  free: { es: "Gratis", en: "Free" },
  month: { es: "/mes", en: "/month" },
  tiersNote: {
    es: "Precios en MXN. Plus y Campus Pass todavía no existen: los estamos validando con estudiantes.",
    en: "Prices in MXN. Plus and Campus Pass don't exist yet: we're validating them with students.",
  },
};

export default function LandingHome() {
  const [lang, setLang] = useState<Lang>("es");
  const L = LANDING;
  const demo = useMemo(() => parseOrderText(DEMO_EXAMPLE), []);

  return (
    <div>
      {/* Hero */}
      <section className="pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-red-600/30 bg-red-600/5 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-400">
            {L.eyebrow[lang]}
          </span>
          <div role="group" aria-label="Language" className="inline-flex rounded-md border border-black/15 p-0.5 text-xs dark:border-white/20">
            {(["es", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded px-2.5 py-1 font-semibold ${lang === l ? "bg-black text-white dark:bg-white dark:text-black" : "text-black/60 dark:text-white/60"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{L.headline[lang]}</h1>
            <p className="mt-4 text-lg text-black/70 dark:text-white/70">{L.subhead[lang]}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={L.primaryCta.href}
                className="rounded-md bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                {L.primaryCta.label[lang]}
              </Link>
              <Link
                href={L.secondaryCta.href}
                className="rounded-md border border-black/15 px-5 py-2.5 font-semibold hover:border-red-600/60 dark:border-white/20"
              >
                {L.secondaryCta.label[lang]}
              </Link>
            </div>
            <p className="mt-4 text-sm text-black/55 dark:text-white/45">{L.notice[lang]}</p>
          </div>

          <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-red-600 px-4 py-2 text-sm text-white">{DEMO_EXAMPLE}</div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-black/45 dark:text-white/40">{T.demoLabel[lang]}</p>
            <ul className="mt-2 divide-y divide-black/10 rounded-lg border border-black/10 bg-white text-sm dark:divide-white/10 dark:border-white/10 dark:bg-black">
              {demo.items.map((i) => (
                <li key={i.name} className="flex justify-between gap-3 px-3 py-2">
                  <span>
                    <strong className="tabular-nums">{i.quantity} ×</strong> {i.name}
                  </span>
                  {i.notes && <span className="text-black/55 dark:text-white/50">{i.notes}</span>}
                </li>
              ))}
              {demo.pickupTimeRaw && (
                <li className="flex justify-between gap-3 px-3 py-2">
                  <span className="text-black/55 dark:text-white/50">{T.pickup[lang]}</span>
                  <span className="font-medium">{demo.pickupTimeRaw}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-black/10 py-12 dark:border-white/10">
        <h2 className="text-2xl font-semibold">{L.stepsTitle[lang]}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {L.steps.map((s, i) => (
            <li key={s.title.en} className="rounded-lg border border-black/10 p-5 dark:border-white/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-3 font-semibold">{s.title[lang]}</h3>
              <p className="mt-1 text-sm text-black/70 dark:text-white/60">{s.body[lang]}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why not just */}
      <section className="border-t border-black/10 py-12 dark:border-white/10">
        <h2 className="text-2xl font-semibold">{L.whyNotTitle[lang]}</h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-3">
          {L.whyNot.map((w) => (
            <div key={w.q.en} className="rounded-lg bg-black/[0.03] p-5 dark:bg-white/[0.04]">
              <dt className="font-semibold">{w.q[lang]}</dt>
              <dd className="mt-2 text-sm text-black/70 dark:text-white/60">{w.a[lang]}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Quote */}
      <section className="border-t border-black/10 py-12 dark:border-white/10">
        <figure className="mx-auto max-w-2xl text-center">
          <blockquote className="text-xl font-medium leading-relaxed sm:text-2xl">{L.quote.text[lang]}</blockquote>
          <figcaption className="mt-3 text-sm text-black/55 dark:text-white/45">{L.quote.attribution[lang]}</figcaption>
        </figure>
      </section>

      {/* Tiers */}
      <section className="border-t border-black/10 py-12 dark:border-white/10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-semibold">{T.tiersTitle[lang]}</h2>
          <Link href="/pricing" className="text-sm text-red-700 underline underline-offset-4 dark:text-red-400">
            {L.secondaryCta.label[lang]} →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <li key={t.name} className="rounded-lg border border-black/10 p-5 dark:border-white/10">
              <p className="font-semibold">{t.name}</p>
              <p className="mt-1 text-2xl font-bold">
                {t.price === 0 ? T.free[lang] : `$${t.price}`}
                {t.price > 0 && <span className="text-sm font-normal text-black/55 dark:text-white/45">{T.month[lang]}</span>}
              </p>
              <p className="mt-2 text-sm text-black/70 dark:text-white/60">{lang === "es" ? (TIER_SUMMARY_ES[t.name] ?? t.summary) : t.summary}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-black/55 dark:text-white/45">{T.tiersNote[lang]}</p>
      </section>

      {/* FAQ */}
      <section className="border-t border-black/10 py-12 dark:border-white/10">
        <h2 className="text-2xl font-semibold">{L.faqTitle[lang]}</h2>
        <dl className="mt-6 space-y-3">
          {L.faq.map((f) => (
            <div key={f.q.en} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
              <dt className="font-semibold">{f.q[lang]}</dt>
              <dd className="mt-1 text-sm text-black/70 dark:text-white/60">{f.a[lang]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
