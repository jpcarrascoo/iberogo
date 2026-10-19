"use client";

import { useMemo } from "react";
import { runMarketingChecks } from "@/lib/marketing";

export default function MarketingChecks() {
  const checks = useMemo(() => runMarketingChecks(), []);
  const passed = checks.filter((c) => c.pass).length;

  return (
    <div>
      <p className="mb-4 text-sm text-black/60 dark:text-white/50">
        These run the page&apos;s own functions against the real content every time the page loads.{" "}
        <strong>
          {passed} of {checks.length} passing.
        </strong>
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {checks.map((c) => (
          <li key={c.name} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium">{c.name}</span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  c.pass ? "bg-green-700/10 text-green-800 dark:text-green-400" : "bg-red-600/15 text-red-700 dark:text-red-400"
                }`}
              >
                {c.pass ? "PASS" : "FAIL"}
              </span>
            </div>
            <p className="mt-1 text-black/60 dark:text-white/50">
              <span className="text-black/40 dark:text-white/35">Expected:</span> {c.expected}
            </p>
            <p className="text-black/60 dark:text-white/50">
              <span className="text-black/40 dark:text-white/35">Actual:</span> {c.actual}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
