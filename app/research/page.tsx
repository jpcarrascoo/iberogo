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
        <div className="rounded-lg border border-black/10 bg-black/5 p-4 text-sm dark:border-white/10 dark:bg-white/5">
  <p className="text-black/60 dark:text-white/50">
    Talked to: a real IBERO student — September 14, 2026
  </p>
  <div className="mt-4 space-y-4">
    <div>
      <p className="font-medium">
        1. Have you ever used an app to order food ahead at IBERO or anywhere else?
      </p>
      <p className="mt-1 text-black/70 dark:text-white/60">
        No, never used one at IBERO, but would definitely like to — it would
        help save time between classes and avoid long lines.
      </p>
    </div>
    <div>
      <p className="font-medium">
        2. Have you heard of Coco, Jit Pickup, or any other pre-order app being
        used here specifically?
      </p>
      <p className="mt-1 text-black/70 dark:text-white/60">
        No — hadn&apos;t heard of any of those being used at IBERO.
      </p>
    </div>
    <div>
      <p className="font-medium">
        3. What would make you actually use something like this, versus just
        walking up?
      </p>
      <p className="mt-1 text-black/70 dark:text-white/60">
        Ease of use, clear menus and prices, and being able to choose pickup
        time and location. Ordering the way you&apos;d text a friend would
        make it more convenient — especially during busy hours.
      </p>
    </div>
    <div>
      <p className="mt-1 text-black/70 dark:text-white/60">
        Found it easy to use and intuitive; thinks students would be able to
        place an order without much difficulty.
      </p>
    </div>
  </div>
</div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-semibold">Add a research note</h2>
