"use client";

import type { ParsedOrder } from "@/lib/parseOrder";

type Props = {
  order: ParsedOrder;
  onSave: () => void;
  saving: boolean;
  saveState: "idle" | "saved" | "error";
};

export default function OutputCard({ order, onSave, saving, saveState }: Props) {
  return (
    <div className="rounded-lg border border-black/15 p-4 dark:border-white/15">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-600/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
        ⚙️ Simulated core — rule-based parser, no external AI API
      </div>

      {order.restaurant && (
        <p className="mb-2 text-sm">
          <span className="font-semibold">Restaurant:</span> {order.restaurant}
        </p>
      )}

      <p className="mb-1 text-sm font-semibold">Items</p>
      {order.items.length === 0 ? (
        <p className="mb-2 text-sm text-black/50 dark:text-white/40">
          No items detected — try rephrasing, e.g. &quot;2 tacos, no onions&quot;.
        </p>
      ) : (
        <ul className="mb-2 space-y-1 text-sm">
          {order.items.map((item, i) => (
            <li key={i}>
              <span className="font-medium">{item.quantity}×</span> {item.name}
              {item.notes && (
                <span className="text-black/50 dark:text-white/40"> — {item.notes}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mb-2 text-sm">
        <span className="font-semibold">Pickup time:</span>{" "}
        {order.pickupTimeRaw ? (
          <>
            {order.pickupTimeRaw}
            {order.pickupTimeIso && (
              <span className="text-black/50 dark:text-white/40">
                {" "}
                (
                {new Date(order.pickupTimeIso).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
                )
              </span>
            )}
          </>
        ) : (
          <span className="text-black/50 dark:text-white/40">not specified</span>
        )}
      </p>

      {order.specialInstructions && (
        <p className="mb-2 text-sm">
          <span className="font-semibold">Notes:</span> {order.specialInstructions}
        </p>
      )}

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="mt-2 rounded-md border border-black/20 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-white/20"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      {saveState === "saved" && (
        <span className="ml-3 text-sm text-emerald-600">Saved ✓</span>
      )}
      {saveState === "error" && (
        <span className="ml-3 text-sm text-red-600">Save failed — check Supabase setup.</span>
      )}
    </div>
  );
}
