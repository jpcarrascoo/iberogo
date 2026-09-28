import Link from "next/link";
import { FEATURES, SEGMENTS, TIER_COLUMNS } from "@/lib/product";

export const metadata = { title: "Product architecture · IBEROGO" };

export default function ProductPage() {
  const built = FEATURES.filter((f) => f.status === "Built").length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-zinc-100">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Product architecture</h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          What IBEROGO is made of, who each feature is for, and what is live today. {built} of {FEATURES.length}{" "}
          features are built; the rest are roadmap and are marked that way.
        </p>
        <Link href="/pricing" className="mt-4 inline-block text-emerald-400 underline underline-offset-4 hover:text-emerald-300">
          See how the tiers are priced
        </Link>
      </header>

      <section aria-labelledby="map-heading" className="mb-12">
        <h2 id="map-heading" className="mb-4 text-xl font-semibold">
          Feature map
        </h2>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Feature</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                {TIER_COLUMNS.map((t) => (
                  <th key={t} scope="col" className="px-3 py-3 text-center font-medium">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {FEATURES.map((f) => (
                <tr key={f.name} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-100">
                      {f.link ? (
                        <Link href={f.link} className="hover:underline">
                          {f.name}
                        </Link>
                      ) : (
                        f.name
                      )}
                    </div>
                    <div className="mt-1 text-zinc-400">{f.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={
                        f.status === "Built"
                          ? "rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300"
                          : "rounded-full border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-400"
                      }
                    >
                      {f.status}
                    </span>
                    <div className="mt-2 text-xs text-zinc-500">{f.week}</div>
                  </td>
                  {TIER_COLUMNS.map((t) => (
                    <td key={t} className="px-3 py-3 text-center">
                      {f.tiers.includes(t) ? (
                        <span aria-label={`Included in ${t}`} className="text-emerald-400">
                          ✓
                        </span>
                      ) : (
                        <span aria-label={`Not in ${t}`} className="text-zinc-700">
                          –
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          Internal tools (research dashboard, pricing simulator) belong to no paid tier.
        </p>
      </section>

      <section aria-labelledby="segments-heading">
        <h2 id="segments-heading" className="mb-4 text-xl font-semibold">
          Two customer segments
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SEGMENTS.map((s) => (
            <article key={s.name} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 text-zinc-400">{s.who}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                {s.gets.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              <p className="mt-4 border-t border-zinc-800 pt-3 text-sm">
                <span className="text-zinc-500">Pays: </span>
                <span className="font-medium text-zinc-100">{s.pays}</span>
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
