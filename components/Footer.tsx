import Link from "next/link";
import { GITHUB_URL, ROUTE_GROUPS, routesIn } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 py-8 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="text-lg font-bold tracking-tight">
              IBERO<span className="text-red-600">GO</span>
            </p>
            <p className="mt-1 text-sm text-black/60 dark:text-white/50">
              Order ahead between classes. A prototype: no real orders or payments yet.
            </p>
            <Link href="/demo" className="mt-3 inline-block text-sm font-medium text-red-600 hover:underline">
              Try the 5-minute demo →
            </Link>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-3 gap-6 text-sm" data-testid="footer-links">
            {ROUTE_GROUPS.map((g) => (
              <div key={g}>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/35">{g}</p>
                <ul className="mt-1 space-y-1">
                  {routesIn(g).map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="text-black/60 hover:text-red-600 dark:text-white/50">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-black/10 pt-4 text-sm text-black/60 sm:flex-row dark:border-white/10 dark:text-white/50">
          <p>
            © {year} IBEROGO. Built as part of the IBERO Build Discipline course. Student project, not affiliated with Universidad
            Iberoamericana.
          </p>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-red-600">
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
