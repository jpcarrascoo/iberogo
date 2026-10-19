import Roadmap from "@/components/Roadmap";
import SupabaseStatus from "@/components/SupabaseStatus";
import ResearchWidget from "@/components/ResearchWidget";
import PricingWidget from "@/components/PricingWidget";
import MarketingWidget from "@/components/MarketingWidget";
import LandingHome from "@/components/LandingHome";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <LandingHome />

      {/* Builder log: the course evidence, kept below the student-facing landing page */}
      <section aria-labelledby="buildlog-h" className="border-t border-black/10 pt-12 dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="buildlog-h" className="text-xl font-semibold">
            Build log
          </h2>
          <SupabaseStatus />
        </div>
        <p className="mt-1 text-sm text-black/60 dark:text-white/50">
          IBEROGO is being built week by week in the IBERO Build Discipline course. Here&apos;s the evidence so far.
        </p>
        <div className="mt-4">
          <ResearchWidget />
          <PricingWidget />
          <MarketingWidget />
        </div>
      </section>

      <Roadmap />
    </div>
  );
}
