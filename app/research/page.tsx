"use client";

import { useState } from "react";
import ResearchIntake from "@/components/research/ResearchIntake";
import SavedResearch from "@/components/research/SavedResearch";
import BenchmarkCards from "@/components/research/BenchmarkCards";
import CompetitorTable from "@/components/research/CompetitorTable";
import RiskMap from "@/components/research/RiskMap";
import { COMPETITORS } from "@/lib/research";

export default function ResearchPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Research + Benchmarking Dashboard
      </h1>
      <p className="mt-2 mb-10 text-black/70 dark:text-white/70">
        Before building more of IBEROGO, this page proves the problem is
        real: what already exists globally, what already exists closer to
        home, and the real risks that come with those findings.
      </p>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          5 global examples this problem is worth solving
        </h2>
        <BenchmarkCards />
      </section>

      <section className="mt-12">
        <h2 className="mb-2 text-lg font-semibold">Mexico localization</h2>
        <p className="mb-4 text-sm text-black/70 dark:text-white/60">
          The closest precedent isn&apos;t global — it&apos;s local. Coco, a
          Mexican campus-ordering platform, lists{" "}
          <strong>Universidad Iberoamericana</strong> on its public client
          page. Infood was built by Tecnológico de Monterrey students solving
          this exact problem at their own campus in 2020. Neither is
          confirmed to be active at IBERO specifically — that&apos;s exactly
          what the human validation conversation below is for.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">
          Competitors &amp; substitutes ({COMPETITORS.length} — 8 required minimum)
        </h2>
        <CompetitorTable />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Risk map</h2>
        <RiskMap />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">
          Human validation conversation
        </h2>
        <div className="rounded-lg border border-dashed border-black/20 p-4 text-sm dark:border-white/20">
          <p className="font-medium">
            [ Replace this with one real conversation — see the questions
            below ]
          </p>
          <p className="mt-2 text-black/60 dark:text-white/50">
            Ask a real IBERO student (or someone who works at a campus
            restaurant/cafeteria):
          </p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-black/60 dark:text-white/50">
            <li>Have you ever used an app to order food ahead at IBERO or anywhere else?</li>
            <li>
              Have you heard of Coco, Jit Pickup, or any other pre-order app
              being used here specifically?
            </li>
            <li>What would make you actually use something like this, versus just walking up?</li>
          </ol>
          <p className="mt-2 text-black/60 dark:text-white/50">
            Then replace this box with: who you talked to (first name or
            role is enough), the date, and what they actually said — even if
            it complicates the pitch. A validation conversation that only
            confirms what you already believed isn&apos;t doing its job.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Add a research note</h2>
        <ResearchIntake onSaved={() => setRefreshKey((k) => k + 1)} />
        <SavedResearch refreshKey={refreshKey} />
      </section>
    </div>
  );
}
