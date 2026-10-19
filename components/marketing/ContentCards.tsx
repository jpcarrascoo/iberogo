"use client";

import { useState } from "react";
import { CHANNEL_LIMITS, POSTS, SCRIPTS, postText, scriptText, type Channel } from "@/lib/marketing";
import { CopyButton, SaveButton } from "./actions";

const CHANNELS: ("All" | Channel)[] = ["All", "Instagram", "Instagram Story", "X", "WhatsApp", "LinkedIn"];

export function PostCards({ onSaved }: { onSaved: () => void }) {
  const [channel, setChannel] = useState<"All" | Channel>("All");
  const shown = channel === "All" ? POSTS : POSTS.filter((p) => p.channel === channel);

  return (
    <div>
      <div role="group" aria-label="Filter by channel" className="mb-4 flex flex-wrap gap-2">
        {CHANNELS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            aria-pressed={channel === c}
            className={`rounded-full border px-3 py-1 text-sm ${
              channel === c
                ? "border-red-600 bg-red-600 text-white"
                : "border-black/15 text-black/70 hover:border-red-600/60 dark:border-white/20 dark:text-white/70"
            }`}
          >
            {c}
            {c !== "All" && <span className="ml-1 opacity-70">({POSTS.filter((p) => p.channel === c).length})</span>}
          </button>
        ))}
      </div>
      <p className="mb-3 text-sm text-black/60 dark:text-white/50" aria-live="polite">
        Showing {shown.length} of {POSTS.length} posts
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {shown.map((p) => {
          const text = postText(p);
          const limit = CHANNEL_LIMITS[p.channel];
          return (
            <li key={p.id} className="flex flex-col rounded-lg border border-black/10 p-4 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-semibold">{p.id}</span>
                <span className="rounded-full bg-red-600/10 px-2 py-0.5 font-medium text-red-700 dark:text-red-400">{p.channel}</span>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-black/60 dark:bg-white/10 dark:text-white/50">{p.pillar}</span>
              </div>
              <p className="mt-1 text-xs text-black/50 dark:text-white/40">{p.format}</p>
              <pre className="mt-3 flex-1 whitespace-pre-wrap font-sans text-sm text-black/85 dark:text-white/80">{text}</pre>
              <p className="mt-3 border-t border-black/10 pt-2 text-xs text-black/55 dark:border-white/10 dark:text-white/45">
                <span className="font-semibold">EN:</span> {p.en}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CopyButton text={text} />
                <SaveButton kind="post" assetId={p.id} title={`${p.id} · ${p.channel} — ${p.format}`} channel={p.channel} body={text} onSaved={onSaved} />
                <span className="ml-auto text-xs tabular-nums text-black/50 dark:text-white/40">
                  {text.length}
                  {limit < 10000 ? ` / ${limit.toLocaleString("en-US")}` : ""} chars
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ScriptCards({ onSaved }: { onSaved: () => void }) {
  return (
    <ul className="space-y-4">
      {SCRIPTS.map((s) => {
        const text = scriptText(s);
        return (
          <li key={s.id} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">
                <span className="mr-2 font-mono text-xs">{s.id}</span>“{s.title}”
              </h3>
              <p className="text-sm text-black/60 dark:text-white/50">
                {s.platform} · {s.length} · {s.pillar}
              </p>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs text-black/50 dark:text-white/40">
                  <tr>
                    <th scope="col" className="w-16 py-1 pr-3 font-medium">Time</th>
                    <th scope="col" className="py-1 pr-3 font-medium">Visual</th>
                    <th scope="col" className="py-1 pr-3 font-medium">On screen</th>
                    <th scope="col" className="py-1 font-medium">Voice-over (ES) / EN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 align-top dark:divide-white/10">
                  {s.scenes.map((sc) => (
                    <tr key={sc.t}>
                      <td className="py-2 pr-3 tabular-nums text-black/60 dark:text-white/50">{sc.t}</td>
                      <td className="py-2 pr-3">{sc.visual}</td>
                      <td className="py-2 pr-3 font-medium">{sc.onScreen || "—"}</td>
                      <td className="py-2">
                        {sc.vo}
                        <span className="block text-xs text-black/50 dark:text-white/40">{sc.en}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-black/55 dark:text-white/45">{s.productionNote}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={text} label="Copy script" />
              <SaveButton kind="script" assetId={s.id} title={`${s.id} · ${s.platform} — “${s.title}”`} channel={s.platform} body={text} onSaved={onSaved} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
