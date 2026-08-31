"use client";

import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

type Row = {
  id: string;
  created_at: string;
  raw_input: string;
  restaurant: string | null;
  items: { name: string; quantity: number; notes: string | null }[];
  pickup_time_raw: string | null;
};

type Props = {
  refreshKey: number;
};

export default function RecentSaves({ refreshKey }: Props) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!supabaseConfigured || !supabase) {
        setError("Supabase isn't configured — check your environment variables.");
        return;
      }
      const { data, error } = await supabase
        .from("core_outputs")
        .select("id, created_at, raw_input, restaurant, items, pickup_time_raw")
        .order("created_at", { ascending: false })
        .limit(5);

      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setRows(data as Row[]);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <div className="mt-10">
      <h2 className="mb-3 text-lg font-semibold">Recent saves</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && rows === null && (
        <p className="text-sm text-black/50 dark:text-white/40">Loading…</p>
      )}
      {!error && rows !== null && rows.length === 0 && (
        <p className="text-sm text-black/50 dark:text-white/40">
          Nothing saved yet — parse an order above and hit Save.
        </p>
      )}
      {!error && rows !== null && rows.length > 0 && (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
              <p className="text-black/50 dark:text-white/40">
                {new Date(row.created_at).toLocaleString()}
                {row.restaurant ? ` · ${row.restaurant}` : ""}
                {row.pickup_time_raw ? ` · ${row.pickup_time_raw}` : ""}
              </p>
              <p className="mt-1">
                {row.items.map((it, i) => (
                  <span key={i}>
                    {i > 0 ? ", " : ""}
                    {it.quantity}× {it.name}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
