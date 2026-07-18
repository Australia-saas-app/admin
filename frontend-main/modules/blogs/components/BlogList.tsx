"use client";

import { useMemo, useState } from "react";
import { Search, Calendar, ChevronDown, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { EmptyState } from "@/src/components/ui/EmptyState";
import BlogCard from "./BlogCard";
import type { BlogProps } from "../types/blog.type";
import { TOTAL_NEWS_RESULTS, formatBlogFilterDate } from "../data/mock-blogs";

interface Props {
  initialData?: BlogProps[];
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

export default function BlogList({ initialData = [] }: Props) {
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = initialData;

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    if (selectedDate) {
      data = data.filter((b) => {
        try {
          const bd = new Date(b.createdAt);
          if (Number.isNaN(bd.getTime())) return false;
          return bd.toISOString().slice(0, 10) === selectedDate;
        } catch {
          return false;
        }
      });
    }

    return data;
  }, [initialData, query, selectedDate]);

  const displayTotal = !query.trim() && !selectedDate ? TOTAL_NEWS_RESULTS : filtered.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const pageData = filtered.slice(pageStart, pageEnd);
  const paginationPages = getPaginationPages(safePage, totalPages);

  const dateLabel = selectedDate ? formatBlogFilterDate(selectedDate) : "23 DEC, 2024";

  return (
    <PublicPageShell
      title="Latest News"
      subtitle="Product updates, industry insights, and platform announcements."
      badge="Blog"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-3 mb-4">
          <div className="flex w-full sm:w-auto sm:min-w-[200px]">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="border border-border rounded-l-md px-2.5 py-1.5 bg-card text-[11px] outline-none w-full focus:ring-1 focus:ring-[#2a2a4a]/20"
            />
            <button
              type="button"
              className="rounded-r-md px-2.5 py-1.5 bg-primary hover:bg-primary/90 transition-colors"
              aria-label="Search news"
            >
              <Search className="h-3.5 w-3.5 text-white" />
            </button>
          </div>

          <div className="relative flex items-center bg-primary text-white rounded-md px-3 py-1.5 text-[10px] font-bold uppercase shadow-sm min-w-[150px] justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {dateLabel}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setPage(1);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Filter by date"
            />
          </div>
        </div>

        {pageData.length === 0 ? (
          <EmptyState
            icon={<Newspaper className="h-8 w-8" />}
            title="No news articles found"
            description="Try another search or date filter to see more posts."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
            {pageData.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        )}

        {pageData.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
            <p className="text-[10px] font-semibold text-[#2a2a4a]">
              Showing {pageStart + 1} To {pageEnd} of {displayTotal} Results
            </p>

            <div className="flex items-center shadow-sm rounded-md overflow-hidden border border-border bg-card self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-2 py-1.5 bg-[#4f6484] text-white hover:bg-[#3f5271] border-r border-border transition-colors disabled:opacity-50"
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
                className="px-2 py-1.5 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
