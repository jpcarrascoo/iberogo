import Roadmap from "@/components/Roadmap";
import SupabaseStatus from "@/components/SupabaseStatus";
import ResearchWidget from "@/components/ResearchWidget";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col items-start gap-4">
        <SupabaseStatus />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Skip the line at IBERO.
        </h1>
        <p className="max-w-xl text-lg text-black/70 dark:text-white/70">
          IBEROGO lets IBERO students order and pay for food ahead of time,
          so it&apos;s ready to pick up the moment they get there — no more
          losing half a break standing in line.
        </p>
        <div className="w-full">
          <ResearchWidget />
        </div>
      </div>

      <Roadmap />
    </div>
  );
}
