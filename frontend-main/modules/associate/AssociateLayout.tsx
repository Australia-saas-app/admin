"use client";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import AssociateCard from "./components/AssociateCard";
import associatesDemo from "./demoData";
import { Pagination } from "@/src/components/ui/pagination";

const PAGE_SIZE = 9;
const CATEGORIES = [
  "All",
  "Technical",
  "Construction",
  "Real Estate",
  "Import & Export",
  "Visa & Travel",
  "Courses",
  "Jobs",
  "Healthcare",
  "Shopping",
  "Donate",
];

export default function AssociateLayout() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = categoriesRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = categoriesRef.current;
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    el?.addEventListener("scroll", updateScrollState);
    return () => {
      window.removeEventListener("resize", handleResize);
      el?.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedCategory = category.toLowerCase();

    let results = associatesDemo;

    if (q) {
      results = results.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.company.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.services || []).join(" ").toLowerCase().includes(q) ||
          (a.serviceArea || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      results = results.filter((a) => a.category.toLowerCase() === selectedCategory);
    }

    return results;
  }, [query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const scrollCategories = (direction: "left" | "right") => {
    const el = categoriesRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.45) || 180;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <PublicPageShell
      title="Our Associates"
      subtitle="Verified partner network across technical, real estate, travel, and professional services."
      badge="Partners"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 mb-5">
        <div className="flex w-full sm:w-auto sm:max-w-xs">
          <input
            type="text"
            placeholder="Search associates"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-border rounded-l-md px-3 py-1.5 bg-card text-xs outline-none w-full focus:ring-1 focus:ring-[#2f3d58]/20"
          />
          <button
            type="button"
            className="rounded-r-md px-3 py-1.5 bg-primary hover:bg-primary/90 transition-colors"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </div>

      <div className="relative mb-5">
        <button
          type="button"
          onClick={() => scrollCategories("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll categories left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={categoriesRef}
          className="flex gap-1.5 overflow-x-auto py-1 scroll-smooth pl-9 pr-9 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={updateScrollState}
        >
          {CATEGORIES.map((item) => {
            const isActive = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-card text-foreground/80 border-border hover:bg-muted/60"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollCategories("right")}
          disabled={!canScrollRight}
          aria-label="Scroll categories right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {pageData.length === 0 ? (
        <div className="bg-card border border-border rounded-md p-8 text-center text-muted-foreground">
          <p className="text-sm font-medium text-foreground mb-1">No associates found</p>
          <p className="text-xs">Try a different category or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {pageData.map((item) => (
            <AssociateCard key={item.id} data={item} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalResults={filtered.length}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </PublicPageShell>
  );
}
