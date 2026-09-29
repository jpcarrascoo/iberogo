import Link from "next/link";
import { PRESETS, TIERS, calculateRevenue } from "@/lib/pricing";

const mxn = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export default function PricingWidget() {
  const base = calculateRevenue(PRESETS.base);
  const vendorShare = Math.round((base.vendorMonthly / base.monthlyTotal) * 100);
  const prices = TIERS.map((t) => mxn(t.price)).join(" / ");

  return (
    <Link
      href="/pricing"
      className="mt-3 block rounded-lg border border-black/10 p-4 transition hover:border-red-600/40 dark:border-white/10"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/30">
        Week 3 — Pricing
      </p>
      <p className="mt-1 text-sm text-black/70 dark:text-white/60">
        <strong>{TIERS.length}</strong> student tiers ({prices} MXN/month) +{" "}
        <strong>{PRESETS.base.commissionPct}%</strong> vendor commission · Base scenario:{" "}
        <strong>{mxn(base.monthlyTotal)}/month</strong> · <strong>{vendorShare}%</strong> of revenue
        comes from vendors, not subscriptions
      </p>
    </Link>
  );
}
