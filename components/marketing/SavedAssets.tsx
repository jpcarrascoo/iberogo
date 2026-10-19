"use client";

import { useEffect, useState } from "react";
import { fetchAssets, saveAsset, type SavedAsset } from "@/lib/supabaseMarketing";
import { BTN_PRIMARY, CopyButton } from "./actions";

const DRAFT_CHANNELS = ["Instagram", "Instagram Story", "TikTok", "X", "WhatsApp", "LinkedIn", "Other"];

export function DraftForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("Instagram");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  const canSave = title.trim().length > 0 && body.trim().length > 0 && state !== "saving";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setState("saving");
    const err = await saveAsset({ kind: "custom", title: title.trim(), channel, body: body.trim() });
    if (err) {
      setError(err);
      setState("error");
      return;
    }
    setState("saved");
    setTitle("");
    setBody("");
    onSaved();
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <h3 className="font-semibold">Draft your own post</h3>
      <p className="text-sm text-black/60 dark:text-white/50">Rewrite a post in your own words, or save a new idea. Follow the voice rules above.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px]">
        <label className="text-sm">
          <span className="text-black/70 dark:text-white/60">Title</span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setState("idle");
            }}
            maxLength={80}
            placeholder="e.g. Story: ¿qué comiste hoy entre clases?"
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-1.5 dark:border-white/20"
          />
        </label>
        <label className="text-sm">
          <span className="text-black/70 dark:text-white/60">Channel</span>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 bg-white px-3 py-1.5 dark:border-white/20 dark:bg-neutral-950"
          >
            {DRAFT_CHANNELS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-3 block text-sm">
        <span className="text-black/70 dark:text-white/60">Text</span>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setState("idle");
          }}
          rows={4}
          maxLength={2200}
          className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
        />
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button type="submit" disabled={!canSave} className={BTN_PRIMARY}>
          {state === "saving" ? "Saving…" : "Save draft"}
        </button>
        <span className="text-xs tabular-nums text-black/50 dark:text-white/40">{body.length} / 2,200</span>
        {state === "saved" && <span className="text-sm text-green-700 dark:text-green-400">Saved ✓</span>}
      </div>
      {state === "error" && <p className="mt-2 text-sm text-red-700 dark:text-red-400">{error}</p>}
    </form>
  );
}

export function SavedList({ refreshKey }: { refreshKey: number }) {
  const [rows, setRows] = useState<SavedAsset[]>([]);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetchAssets(8).then(({ rows, error }) => {
      if (!active) return;
      setRows(rows);
      setError(error);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  if (error) return <p className="text-sm text-red-700 dark:text-red-400">{error}</p>;
  if (!loaded) return <p className="text-sm text-black/50 dark:text-white/40">Loading saved assets…</p>;
  if (rows.length === 0) return <p className="text-sm text-black/60 dark:text-white/50">Nothing saved yet. Hit Save on any post, script or copy block.</p>;

  return (
    <ul className="divide-y divide-black/10 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/10">
      {rows.map((r) => (
        <li key={r.id} className="px-4 py-3 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">{r.title}</p>
            <CopyButton text={r.body} />
          </div>
          <p className="text-xs text-black/50 dark:text-white/40">
            {new Date(r.created_at).toLocaleString()} · {r.kind}
            {r.channel ? ` · ${r.channel}` : ""}
          </p>
          <p className="mt-1 line-clamp-2 text-black/70 dark:text-white/60">{r.body}</p>
        </li>
      ))}
    </ul>
  );
}
