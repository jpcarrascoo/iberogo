"use client";

import { useState } from "react";
import { EXAMPLE_ORDERS } from "@/lib/parseOrder";

type Props = {
  onParse: (text: string) => void;
};

export default function IntakeForm({ onParse }: Props) {
  const [text, setText] = useState("");

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {EXAMPLE_ORDERS.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setText(ex)}
            className="rounded-full border border-black/15 px-3 py-1 text-xs text-black/60 hover:border-black/30 hover:text-black dark:border-white/15 dark:text-white/50 dark:hover:text-white"
          >
            Try example {i + 1}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. 2 tacos, no onions, and a coke from Cafeteria Central, pickup around 1pm"
        rows={4}
        className="w-full rounded-lg border border-black/15 bg-white p-3 text-sm outline-none focus:border-black/40 dark:border-white/15 dark:bg-black/20 dark:focus:border-white/40"
      />

      <button
        type="button"
        disabled={!text.trim()}
        onClick={() => onParse(text.trim())}
        className="mt-3 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-30 dark:bg-white dark:text-black"
      >
        Parse Order
      </button>
    </div>
  );
}
