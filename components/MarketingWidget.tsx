import Link from "next/link";
import { AB_TESTS, CALENDAR, POSTS, SCRIPTS } from "@/lib/marketing";

export default function MarketingWidget() {
  return (
    <Link
      href="/marketing"
      className="mt-3 block rounded-lg border border-black/10 p-4 transition hover:border-red-600/40 dark:border-white/10"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/30">Week 4 — Marketing</p>
      <p className="mt-1 text-sm text-black/70 dark:text-white/60">
        <strong>{POSTS.length}</strong> social posts · <strong>{SCRIPTS.length}</strong> video scripts ·{" "}
        <strong>{CALENDAR.length}</strong>-day calendar · <strong>{AB_TESTS.length}</strong> A/B tests run with real IBERO students to pick
        the message
      </p>
    </Link>
  );
}
