"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { SearchInput } from "@/src/components/form/search-input";
import { Pagination } from "@/src/components/ui/pagination";
import GalleryCard from "./GalleryCard";
import GalleryViewer from "./GalleryViewer";
import { GalleryItem } from "../types/gallery.type";
import { Button } from "@/src/components/ui/button";
import { useLocale } from "@/src/shared/context/locale.provider";


interface Props {
  initialData?: GalleryItem[];
}

const PAGE_SIZE = 12;

export default function GalleryList({ initialData = [] }: Props) {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("__all__");
  const [viewer, setViewer] = useState<{ images: string[];  index: number;  categoryName?: string } | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = categoriesRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    // small epsilon to avoid rounding issues
    setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
  }, []);

  const onCategoriesScroll = useCallback(() => updateScrollState(), [updateScrollState]);

  useEffect(() => {
    updateScrollState();
    const el = categoriesRef.current;
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    if (el) el.addEventListener("scroll", onCategoriesScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (el) el.removeEventListener("scroll", onCategoriesScroll);
    };
  }, [initialData, onCategoriesScroll, updateScrollState]);

  const categories = useMemo(() => {
    const set = new Set(initialData.map((i) => i.categoryName || t.gallery.uncategorized));
    return [
      { value: "__all__", label: t.gallery.all },
      ...Array.from(set).map((name) => ({ value: name, label: name })),
    ];
  }, [initialData, t.gallery.all, t.gallery.uncategorized]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    return initialData.filter((i) => {
      if (q && !(i.categoryName || "").toLowerCase().includes(q)) return false;
      if (selectedCategory !== "__all__") {
        const cat = i.categoryName || t.gallery.uncategorized;
        if (cat !== selectedCategory) return false;
      }
      return true;
    });
  }, [initialData, query, selectedCategory, t.gallery.uncategorized]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PublicPageShell
      title={t.gallery.title}
      subtitle="Browse project galleries, events, and visual highlights from our global network."
      badge="Gallery"
    >
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="w-full max-w-sm">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder={t.gallery.searchPlaceholder} />
        </div>
      </div>

      {/* Category chips / filters with left/right arrows */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button
            
            onClick={() => {
              const el = categoriesRef.current;
              if (!el) return;
              const amount = Math.round(el.clientWidth * 0.5) || 200;
              el.scrollBy({ left: -amount, behavior: "smooth" });
            }}
            aria-label="Scroll categories left"
            disabled={!canScrollLeft}
          >
            ‹
          </Button>
        </div>

        <div
          ref={categoriesRef}
          className="flex gap-2 overflow-x-auto py-2 scroll-smooth pl-10 pr-10"
          onScroll={onCategoriesScroll}
        >
          {categories.map((c) => {
            const active = c.value === selectedCategory;
            return (
              <Button
                variant={`${active ? "default" : "outline"}`}
                key={c.value}
                onClick={() => {
                  setSelectedCategory(c.value);
                  setPage(1);
                }}
              >
                {c.label}
              </Button>
            );
          })}
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Button
          
            onClick={() => {
              const el = categoriesRef.current;
              if (!el) return;
              const amount = Math.round(el.clientWidth * 0.5) || 200;
              el.scrollBy({ left: amount, behavior: "smooth" });
            }}
            aria-label="Scroll categories right"
            disabled={!canScrollRight}
          >
            ›
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {pageData.map((it) => (
          <GalleryCard
            key={it.id}
            id={it.id}
            categoryName={it.categoryName}
            description={it.description}
            createdAt={it.createdAt}
            images={it.images}
            onOpen={() =>
              setViewer({
                images: it.images.map((img) => img.imageUrl),
                index: 0,
                categoryName: it.categoryName,
              })
            }
          />
        ))}
      </div>

      <div className="pt-4">
        <Pagination currentPage={page} totalPages={totalPages} pageSize={PAGE_SIZE} totalResults={filtered.length} onPageChange={(p) => setPage(p)} />
      </div>

   

      {viewer && (
        <GalleryViewer
          images={viewer?.images}
          startIndex={viewer.index}
          title={viewer?.categoryName}
   
          // pass all images + allow navigation inside the viewer
          onClose={() => setViewer(null)}
        />
      )}
    </div>
    </PublicPageShell>
  );
}
