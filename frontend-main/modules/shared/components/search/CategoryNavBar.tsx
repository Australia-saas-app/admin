"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { CATEGORY_NAV, CATEGORY_NAV_MORE } from "@/src/shared/constants/mega-menu";

export default function CategoryNavBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const moreActive = CATEGORY_NAV_MORE.some((item) => isActive(item.href));

  return (
    <div className="hidden border-t border-border/60 bg-background md:block">
      <div className="container mx-auto flex items-center px-4 py-2 md:px-6">
        <div className="relative min-w-0 flex-1">
          <nav
            aria-label="Categories"
            className="flex items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORY_NAV.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative ml-1 shrink-0">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            aria-haspopup="true"
            className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              moreActive || moreOpen
                ? "bg-primary/10 font-semibold text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
          >
            More
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
            />
          </button>
          {moreOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                aria-label="Close more menu"
                onClick={() => setMoreOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-56 animate-in fade-in slide-in-from-top-1 overflow-hidden rounded-xl border border-border bg-background p-1.5 shadow-xl duration-150">
                {CATEGORY_NAV_MORE.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive(item.href)
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
