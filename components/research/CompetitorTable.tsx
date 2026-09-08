"use client";

import { useMemo, useState } from "react";
import { COMPETITORS, type CompetitorType } from "@/lib/research";

const TYPE_FILTERS: (CompetitorType | "All")[] = [
  "All",
  "Global example",
  "Mexico",
  "Substitute",
];

export default function CompetitorTable() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<CompetitorType | "All">("All");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPETITORS.filter((c) => {
      const matchesType = type === "All" || c.type === type;
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [query, type]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, region, or category…"
          className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/15 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={
                "rounded-full border px-3 py-1 text-xs font-medium " +
                (type === t
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-black/15 text-black/60 hover:border-black/30 dark:border-white/15 dark:text-white/50")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-black/5 text-xs uppercase tracking-wide text-black/50 dark:bg-white/5 dark:text-white/40">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Region</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Key fact</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-black/5 dark:border-white/5">
                <td className="px-3 py-2 font-medium">{c.name}</td>
                <td className="px-3 py-2 text-black/60 dark:text-white/50">{c.region}</td>
                <td className="px-3 py-2 text-black/60 dark:text-white/50">{c.type}</td>
                <td className="px-3 py-2 text-black/60 dark:text-white/50">{c.category}</td>
                <td className="px-3 py-2 text-black/60 dark:text-white/50">{c.keyFact}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-black/40 dark:text-white/30">
                  No competitors match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-black/40 dark:text-white/30">
        {rows.length} of {COMPETITORS.length} shown.
      </p>
    </div>
  );
}
