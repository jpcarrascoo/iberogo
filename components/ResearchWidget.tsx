import Link from "next/link";
import { COMPETITORS, RISKS } from "@/lib/research";

export default function ResearchWidget() {
  const highRisks = RISKS.filter((r) => r.likelihood === "High" && r.impact === "High").length;

  return (
    <Link
      href="/research"
      className="block rounded-lg border border-black/10 p-4 transition hover:border-red-600/40 dark:border-white/10"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/30">
        Week 2 — Research
      </p>
      <p className="mt-1 text-sm text-black/70 dark:text-white/60">
        <strong>{COMPETITORS.length}</strong> competitors/substitutes analyzed ·{" "}
        <strong>{highRisks}</strong> high-likelihood, high-impact risk flagged ·
        closest local precedent: <strong>Coco</strong> (lists Universidad
        Iberoamericana as a client)
      </p>
    </Link>
  );
}
