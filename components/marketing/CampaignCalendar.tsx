"use client";

import { assetLabel, calendarCsv, calendarWithDates } from "@/lib/marketing";
import { BTN, downloadText } from "./actions";

const GOAL_CLASS: Record<string, string> = {
  Awareness: "bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/60",
  Engagement: "bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/60",
  "Demo visits": "bg-red-600/10 text-red-700 dark:text-red-400",
  Feedback: "bg-red-600/10 text-red-700 dark:text-red-400",
  Learn: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  Trust: "bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/60",
};

export default function CampaignCalendar({ start, onStartChange }: { start: string; onStartChange: (v: string) => void }) {
  const days = calendarWithDates(start);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="block text-black/70 dark:text-white/60">Campaign start date</span>
          <input
            type="date"
            value={start}
            onChange={(e) => onStartChange(e.target.value)}
            className="mt-1 rounded-md border border-black/15 bg-transparent px-3 py-1.5 dark:border-white/20"
          />
        </label>
        <button type="button" className={BTN} onClick={() => downloadText("iberogo-campaign-calendar.csv", calendarCsv(start), "text/csv")}>
          Export calendar (.csv)
        </button>
      </div>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((d) => (
          <li
            key={d.day}
            className={`rounded-lg border p-3 text-sm ${
              d.channel === "In person" ? "border-amber-500/50 bg-amber-500/5" : "border-black/10 dark:border-white/10"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Day {d.day}</p>
            <p className="font-medium">{d.date}</p>
            <p className="mt-1 text-black/70 dark:text-white/60">{d.channel}</p>
            <p className="mt-1 font-mono text-xs font-semibold" title={d.assetIds.map(assetLabel).join(" + ")}>
              {d.assetIds.join(" + ")}
            </p>
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${GOAL_CLASS[d.goal] ?? ""}`}>{d.goal}</span>
            <p className="mt-1 text-xs text-black/55 dark:text-white/45">{d.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
