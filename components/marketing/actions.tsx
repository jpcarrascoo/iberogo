"use client";

import { useEffect, useState } from "react";
import { saveAsset, type AssetKind } from "@/lib/supabaseMarketing";

export const BTN =
  "rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium hover:border-red-600/60 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:text-red-400";

export const BTN_PRIMARY =
  "rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:bg-black/20 dark:disabled:bg-white/20";

export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button type="button" onClick={copy} className={BTN} aria-live="polite">
      {state === "copied" ? <span className="text-green-700 dark:text-green-400">Copied ✓</span> : state === "failed" ? "Copy failed — select manually" : label}
    </button>
  );
}

export function SaveButton({
  kind,
  assetId,
  title,
  channel,
  body,
  onSaved,
}: {
  kind: AssetKind;
  assetId: string;
  title: string;
  channel?: string;
  body: string;
  onSaved: () => void;
}) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function save() {
    setState("saving");
    const err = await saveAsset({ kind, asset_id: assetId, title, channel, body });
    if (err) {
      setError(err);
      setState("error");
      return;
    }
    setState("saved");
    onSaved();
  }

  return (
    <>
      <button type="button" onClick={save} disabled={state === "saving"} className={BTN}>
        {state === "saving" ? "Saving…" : state === "saved" ? <span className="text-green-700 dark:text-green-400">Saved ✓</span> : "Save"}
      </button>
      {state === "error" && <p className="w-full text-sm text-red-700 dark:text-red-400">{error}</p>}
    </>
  );
}
