"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROUTES, ROUTE_GROUPS, isActive, routesIn } from "@/lib/site";

const linkClass = (active: boolean) =>
  active
    ? "text-red-600 underline underline-offset-4"
    : "text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onDemo = isActive(pathname, "/demo");

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight" onClick={() => setOpen(false)}>
          IBERO<span className="text-red-600">GO</span>
        </Link>

        {/* Desktop: every page in one row */}
        <ul className="hidden items-center gap-4 text-sm font-medium whitespace-nowrap lg:flex" data-testid="nav-desktop">
          {ROUTES.map((r) => (
            <li key={r.href}>
              <Link href={r.href} aria-current={isActive(pathname, r.href) ? "page" : undefined} className={linkClass(isActive(pathname, r.href))}>
                {r.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile / tablet: CTA + menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          {!onDemo && (
            <Link href="/demo" className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700" onClick={() => setOpen(false)}>
              Try the demo
            </Link>
          )}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium dark:border-white/20"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-black/10 px-4 pb-4 lg:hidden dark:border-white/10" data-testid="nav-mobile">
          <div className="mx-auto grid max-w-6xl gap-4 pt-3 sm:grid-cols-3">
            {ROUTE_GROUPS.map((g) => (
              <div key={g}>
                <p className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/35">{g}</p>
                <ul className="mt-1 space-y-1 text-sm font-medium">
                  {routesIn(g).map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        aria-current={isActive(pathname, r.href) ? "page" : undefined}
                        className={`block py-1 ${linkClass(isActive(pathname, r.href))}`}
                        onClick={() => setOpen(false)}
                      >
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
