"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import type { GlobalBranch } from "../types/global.type";
import BranchCard from "./BranchCard";
import { TOTAL_BRANCH_RESULTS } from "../data/mock-branches";

interface Props {
  initialData?: GlobalBranch[];
}

const PAGE_SIZE = 12;

function getPaginationPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, 2, 3, total - 1, total]);
  if (current > 3 && current < total - 2) {
    pages.add(current - 1);
    pages.add(current);
    pages.add(current + 1);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}

export default function BranchList({ initialData = [] }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return initialData;
    const q = query.toLowerCase();
    return initialData.filter(
      (b) =>
        b.branchName.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        (b.phone || "").toLowerCase().includes(q) ||
        (b.emailAddress || "").toLowerCase().includes(q)
    );
  }, [initialData, query]);

  const displayTotal = !query.trim() ? TOTAL_BRANCH_RESULTS : filtered.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const pageData = filtered.slice(pageStart, pageEnd);
  const paginationPages = getPaginationPages(safePage, totalPages);

  return (
    <PublicPageShell
      title="Global Branches"
      subtitle="Find our offices worldwide for in-person support and regional services."
      badge="Locations"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 mb-5">
        <div className="flex w-full sm:w-auto sm:max-w-xs">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="border border-border rounded-l-md px-3 py-1.5 bg-card text-xs outline-none w-full focus:ring-1 focus:ring-[#2f3d58]/20"
          />
          <button
            type="button"
            className="rounded-r-md px-3 py-1.5 bg-primary hover:bg-primary/90 transition-colors"
            aria-label="Search branches"
          >
            <Search className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>

      {pageData.length === 0 ? (
        <div className="bg-card border border-border rounded-md p-8 text-center text-muted-foreground">
          <p className="text-sm font-medium text-foreground mb-1">No branches found</p>
          <p className="text-xs">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {pageData.map((b) => (
            <BranchCard
              key={b.id}
              branchName={b.branchName}
              address={b.address}
              phone={b.phone}
              emailAddress={b.emailAddress}
            />
          ))}
        </div>
      )}

      {pageData.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
          <p className="text-[11px] font-semibold text-[#2f3d58]">
            Showing {pageStart + 1} To {pageEnd} of {displayTotal} Results
          </p>

          <div className="flex items-center shadow-sm rounded-md overflow-hidden border border-border bg-card self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-2 py-1.5 bg-primary text-white hover:bg-primary/90 border-r border-border transition-colors disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {paginationPages.map((p, idx) =>
              p === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1.5 text-[10px] text-muted-foreground border-r border-border"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`px-2.5 py-1.5 text-[10px] font-medium border-r border-border transition-colors ${
                    safePage === p
                      ? "bg-primary text-white"
                      : "bg-primary/80 text-white hover:bg-primary/90"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-2 py-1.5 bg-[#4f6484] text-white hover:bg-[#3f5271] transition-colors disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </PublicPageShell>
  );
}
