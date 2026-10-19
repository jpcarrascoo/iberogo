"use client";

import { useState, type ReactNode } from "react";
import { DEFAULT_START_DATE, POSTS, SCRIPTS, toMarkdown } from "@/lib/marketing";
import BrandSystem from "@/components/marketing/BrandSystem";
import PersonaCard from "@/components/marketing/PersonaCard";
import LandingCopy from "@/components/marketing/LandingCopy";
import { PostCards, ScriptCards } from "@/components/marketing/ContentCards";
import CampaignCalendar from "@/components/marketing/CampaignCalendar";
import ABTester from "@/components/marketing/ABTester";
import { DraftForm, SavedList } from "@/components/marketing/SavedAssets";
import MarketingChecks from "@/components/marketing/MarketingChecks";
import { BTN_PRIMARY, downloadText } from "@/components/marketing/actions";

type Zone = "Plan" | "Output" | "Input" | "Saved" | "Testing";

const ZONE_CLASS: Record<Zone, string> = {
  Plan: "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/50",
  Output: "bg-red-600/10 text-red-700 dark:text-red-400",
  Input: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  Saved: "bg-green-700/10 text-green-800 dark:text-green-400",
  Testing: "bg-sky-500/15 text-sky-800 dark:text-sky-300",
};

const SECTIONS = [
  { id: "brand", label: "Brand" },
  { id: "persona", label: "Persona" },
  { id: "landing", label: "Landing copy" },
  { id: "posts", label: "10 posts" },
  { id: "scripts", label: "3 scripts" },
  { id: "calendar", label: "14 days" },
  { id: "ab", label: "A/B test" },
  { id: "saved", label: "Saved" },
  { id: "checks", label: "Checks" },
];

function Section({ id, title, zone, children }: { id: string; title: string; zone: Zone; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-black/10 pt-8 dark:border-white/10">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 id={`${id}-h`} className="text-xl font-semibold">
          {title}
        </h2>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${ZONE_CLASS[zone]}`}>{zone}</span>
      </div>
      {children}
    </section>
  );
}

export default function MarketingPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [start, setStart] = useState(DEFAULT_START_DATE);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Week 4 — Marketing engine</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Marketing Engine + Content System</h1>
        <p className="mt-3 max-w-2xl text-black/70 dark:text-white/60">
          Everything IBEROGO needs to tell IBERO students it exists: a brand system, who we&apos;re talking to, landing page copy,{" "}
          {POSTS.length} social posts, {SCRIPTS.length} video scripts, a 14-day calendar, and an A/B tester to pick the message with real
          students instead of guessing.
        </p>
        <p className="mt-3 max-w-2xl rounded-md border border-black/10 bg-black/5 px-3 py-2 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
          <strong>How this content was made:</strong> drafted with an AI coding assistant from real inputs (Week 1–3 research and two real
          student conversations), stored as fixed data in <code>lib/marketing.ts</code>, and reviewed by a human before posting. Nothing on
          this page calls an AI API or posts automatically.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className={BTN_PRIMARY} onClick={() => downloadText("iberogo-marketing-kit.md", toMarkdown(start), "text/markdown")}>
            Export kit (.md)
          </button>
          <nav aria-label="On this page" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-black/60 hover:text-red-700 dark:text-white/50 dark:hover:text-red-400">
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="space-y-12">
        <Section id="brand" title="Brand system" zone="Plan">
          <BrandSystem />
        </Section>

        <Section id="persona" title="Target persona" zone="Plan">
          <PersonaCard />
        </Section>

        <Section id="landing" title="Landing page copy" zone="Output">
          <LandingCopy onSaved={bump} />
        </Section>

        <Section id="posts" title={`Social posts (${POSTS.length})`} zone="Output">
          <PostCards onSaved={bump} />
        </Section>

        <Section id="scripts" title={`Video scripts (${SCRIPTS.length})`} zone="Output">
          <ScriptCards onSaved={bump} />
        </Section>

        <Section id="calendar" title="14-day campaign calendar" zone="Input">
          <CampaignCalendar start={start} onStartChange={setStart} />
        </Section>

        <Section id="ab" title="A/B headline test" zone="Input">
          <ABTester />
        </Section>

        <Section id="saved" title="Saved marketing assets" zone="Saved">
          <div className="grid gap-6 lg:grid-cols-2">
            <DraftForm onSaved={bump} />
            <div>
              <h3 className="mb-3 font-semibold">8 most recent saves</h3>
              <SavedList refreshKey={refreshKey} />
            </div>
          </div>
        </Section>

        <Section id="checks" title="Marketing logic checks" zone="Testing">
          <MarketingChecks />
        </Section>
      </div>
    </div>
  );
}
