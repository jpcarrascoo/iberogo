"use client";

import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

type Row = {
  id: string;
  created_at: string;
  title: string;
  notes: string | null;
  category: string | null;
};

type Props = {
  refreshKey: number;
};

export default function SavedResearch({ refreshKey }: Props) {
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
        .from("research_entries")
        .select("id, created_at, title, notes, category")
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
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-black/50 dark:text-white/40">
        Saved research notes
      </h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!error && rows === null && (
        <p className="text-sm text-black/50 dark:text-white/40">Loading…</p>
      )}
      {!error && rows !== null && rows.length === 0 && (
        <p className="text-sm text-black/50 dark:text-white/40">
          Nothing saved yet — add a research note above.
        </p>
      )}
      {!error && rows !== null && rows.length > 0 && (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
              <p className="text-black/50 dark:text-white/40">
                {new Date(row.created_at).toLocaleString()}
                {row.category ? ` · ${row.category}` : ""}
              </p>
              <p className="mt-1 font-medium">{row.title}</p>
              {row.notes && (
                <p className="mt-1 text-black/60 dark:text-white/50">{row.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
