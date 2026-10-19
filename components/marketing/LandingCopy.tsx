"use client";

import Link from "next/link";
import { LANDING, landingText, type Lang } from "@/lib/marketing";
import { CopyButton, SaveButton } from "./actions";

export default function LandingCopy({ onSaved }: { onSaved: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-black/60 dark:text-white/50">
        This is the same copy the{" "}
        <Link href="/" className="text-red-700 underline underline-offset-4 dark:text-red-400">
          homepage
        </Link>{" "}
        renders — one source of truth in <code>lib/marketing.ts</code>. The headline is Test 1&apos;s variant {"“"}
        {LANDING.headline.es}{"”"} until the A/B test picks a winner.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {(["es", "en"] as Lang[]).map((lang) => {
          const text = landingText(lang);
          return (
            <article key={lang} className="flex flex-col rounded-lg border border-black/10 p-4 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">
                {lang === "es" ? "Español (primary)" : "English"}
              </p>
              <pre className="mt-2 max-h-72 flex-1 overflow-auto whitespace-pre-wrap font-sans text-sm text-black/80 dark:text-white/70">{text}</pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyButton text={text} />
                <SaveButton
                  kind="copy"
                  assetId={`LANDING-${lang.toUpperCase()}`}
                  title={`Landing page copy (${lang.toUpperCase()})`}
                  channel="Website"
                  body={text}
                  onSaved={onSaved}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
