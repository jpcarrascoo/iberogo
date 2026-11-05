import type { OrderSummary } from "@/lib/chat";

export default function SummaryCard({ summary }: { summary: OrderSummary }) {
  return (
    <div className="mt-2 rounded-lg border border-red-600/30 bg-white p-3 text-sm text-black dark:bg-neutral-950 dark:text-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">Order summary · not sent anywhere</p>
      <ul className="mt-2 space-y-0.5">
        {summary.items.map((i, n) => (
          <li key={n}>
            <strong>{i.quantity}×</strong> {i.name}
            {i.notes && <span className="text-black/60 dark:text-white/50"> · {i.notes}</span>}
          </li>
        ))}
      </ul>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 text-black/70 dark:text-white/60">
        <dt>Pickup time</dt>
        <dd className="font-medium text-black dark:text-white">{summary.pickupTime}</dd>
        <dt>Pickup point</dt>
        <dd className="font-medium text-black dark:text-white">{summary.pickupPoint}</dd>
      </dl>
      {summary.allergyNote && (
        <p className="mt-2 rounded bg-amber-500/15 px-2 py-1 text-amber-900 dark:text-amber-200">
          ⚠ Allergy note: {summary.allergyNote} · a person must check this with the vendor
        </p>
      )}
    </div>
  );
}
