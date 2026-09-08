"use client";

import { useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

type Props = {
  onSaved: () => void;
};

const CATEGORY_OPTIONS = ["Competitor note", "Risk note", "Interview note", "Other"];

export default function ResearchIntake({ onSaved }: Props) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  async function handleSave() {
    if (!title.trim() || !supabaseConfigured || !supabase) {
      setSaveState("error");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("research_entries").insert({
      title: title.trim(),
      notes: notes.trim(),
      category,
    });
    setSaving(false);
    if (error) {
      setSaveState("error");
    } else {
      setSaveState("saved");
      setTitle("");
      setNotes("");
      onSaved();
    }
  }

  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <label className="mb-1 block text-xs font-semibold text-black/50 dark:text-white/40">
        Category
      </label>
      <div className="mb-3 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium " +
              (category === c
                ? "border-red-600 bg-red-600 text-white"
                : "border-black/15 text-black/60 hover:border-black/30 dark:border-white/15 dark:text-white/50")
            }
          >
            {c}
          </button>
        ))}
      </div>

      <label className="mb-1 block text-xs font-semibold text-black/50 dark:text-white/40">
        Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Coco already serves Universidad Iberoamericana"
        className="mb-3 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
      />

      <label className="mb-1 block text-xs font-semibold text-black/50 dark:text-white/40">
        Notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="What did you find, or what did someone tell you?"
        className="mb-3 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/15"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save research note"}
        </button>
        {saveState === "saved" && (
          <span className="text-sm font-medium text-green-600">Saved ✓</span>
        )}
        {saveState === "error" && (
          <span className="text-sm font-medium text-red-600">
            Save failed — check Supabase setup, or add a title.
          </span>
        )}
      </div>
    </div>
  );
}
