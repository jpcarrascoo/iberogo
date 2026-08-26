"use client";

import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

type Status = "checking" | "connected" | "not-connected";

export default function SupabaseStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!supabaseConfigured || !supabase) {
        if (!cancelled) setStatus("not-connected");
        return;
      }
      try {
        // Lightweight, non-destructive call: just proves the client can
        // talk to the Supabase project using the configured env vars.
        // No tables or auth are used this week.
        const { error } = await supabase.auth.getSession();
        if (!cancelled) setStatus(error ? "not-connected" : "connected");
      } catch {
        if (!cancelled) setStatus("not-connected");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    status === "checking"
      ? "Checking Supabase connection…"
      : status === "connected"
        ? "Supabase: connected"
        : "Supabase: not connected";

  const dotColor =
    status === "checking"
      ? "bg-black/30 dark:bg-white/30"
      : status === "connected"
        ? "bg-emerald-600"
        : "bg-red-500";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-black/70 dark:border-white/10 dark:text-white/70">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {label}
    </div>
  );
}
