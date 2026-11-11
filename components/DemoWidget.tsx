import Link from "next/link";
import { DEMO_STEPS, runDemoChecks, TESTER_TARGET } from "@/lib/demo";
import { AGENT_MAP, TABLES } from "@/lib/site";
import { ROADMAP_V2 } from "@/lib/roadmap";

export default function DemoWidget() {
  const checks = runDemoChecks();
  const passed = checks.filter((c) => c.pass).length;
  return (
    <Link
      href="/demo"
      className="mt-3 block rounded-lg border border-black/10 p-4 transition hover:border-red-600/40 dark:border-white/10"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/30">Week 6 · Integrated venture</p>
      <p className="mt-1 text-sm text-black/70 dark:text-white/60">
        A <strong>{DEMO_STEPS.length}</strong>-step guided demo, an agent map of <strong>{AGENT_MAP.length}</strong> parts, a dashboard of{" "}
        <strong>{TABLES.length}</strong> tables and a <strong>{ROADMAP_V2.length}</strong>-item Version 2 roadmap · target{" "}
        <strong>{TESTER_TARGET}</strong> new testers ·{" "}
        <strong>
          {passed}/{checks.length}
        </strong>{" "}
        demo checks passing
      </p>
    </Link>
  );
}
