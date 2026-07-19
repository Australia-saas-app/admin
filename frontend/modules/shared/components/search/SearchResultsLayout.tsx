"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import UniversalSearch from "./UniversalSearch";
import {
  SEARCH_CATEGORY_LABELS,
  SEARCH_CATEGORY_ORDER,
  universalSearch,
  type SearchCategory,
} from "@/src/shared/lib/universal-search";

export default function SearchResultsLayout({ query }: { query: string }) {
  const result = universalSearch(query, 8);
  const categories = SEARCH_CATEGORY_ORDER.filter(
    (c) => c !== "ai" && (result.groups[c]?.length ?? 0) > 0
  ) as SearchCategory[];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Search</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find products, services, businesses, jobs, courses, travel, and more in one place.
        </p>
        <div className="mt-5">
          <UniversalSearch variant="page" initialQuery={query} autoFocus={!query} />
        </div>
      </div>

      {!query.trim() ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">Try asking or searching</p>
          <ul className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm text-muted-foreground">
            {[
              "I need a cheap flight to Dubai next month",
              "Find me a software engineer",
              "Best laptops under $700",
              "How do I register a company?",
              "Find a dentist near me",
            ].map((example) => (
              <li key={example}>
                <Link
                  href={`/search?q=${encodeURIComponent(example)}`}
                  className="block rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {example}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-8">
          {result.aiAnswer && (
            <section className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                AI Answer
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{result.aiAnswer}</p>
            </section>
          )}

          {result.total === 0 ? (
            <div className="rounded-2xl border border-border px-6 py-12 text-center">
              <p className="font-semibold text-foreground">No results for “{query}”</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a broader term or browse All Services from the header.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {result.total} result{result.total === 1 ? "" : "s"} for{" "}
                <span className="font-semibold text-foreground">“{query}”</span>
              </p>

              {result.flat[0] && (
                <section>
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Top Result
                  </h2>
                  <Link
                    href={result.flat[0].href}
                    className="block rounded-2xl border border-border bg-background p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {SEARCH_CATEGORY_LABELS[result.flat[0].category]}
                    </span>
                    <p className="mt-1 text-lg font-bold text-foreground">{result.flat[0].title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {result.flat[0].description}
                    </p>
                  </Link>
                </section>
              )}

              {categories.map((cat) => {
                const items = result.groups[cat] ?? [];
                return (
                  <section key={cat}>
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-base font-bold text-foreground">
                        {SEARCH_CATEGORY_LABELS[cat]}
                      </h2>
                      <span className="text-xs text-muted-foreground">{items.length}</span>
                    </div>
                    <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
                      {items.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className="flex items-start justify-between gap-3 px-4 py-3.5 transition hover:bg-muted/50"
                          >
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground">{item.title}</p>
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            {item.badge && (
                              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
