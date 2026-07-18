"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, X } from "lucide-react";
import { useRecentlyViewed } from "@/src/shared/hooks/useRecentlyViewed";
import { clearRecentlyViewed } from "@/src/lib/recently-viewed";

/**
 * "Recently viewed" strip shown on the homepage. Renders nothing until the
 * visitor has opened at least one detail page.
 */
export function RecentlyViewedSection() {
  const items = useRecentlyViewed(8);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6" aria-label="Recently viewed">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground md:text-2xl">
          <Clock className="h-5 w-5 text-primary" aria-hidden />
          Recently viewed
        </h2>
        <button
          type="button"
          onClick={clearRecentlyViewed}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden /> Clear
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={item.href}
            className="card-lift group overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative h-28 w-full bg-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.type}
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {item.type}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
