"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/core", label: "Core" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          IBERO<span className="text-red-600">GO</span>
        </Link>
        <ul className="flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    isActive
                      ? "text-red-600 underline underline-offset-4"
                      : "text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
