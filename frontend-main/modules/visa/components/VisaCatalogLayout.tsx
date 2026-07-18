"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { useInfiniteScroll } from "@/src/shared/hooks/useInfiniteScroll";
import { VisaStampImage } from "./VisaStampImage";
import {
  TOTAL_VISA_RESULTS,
  VISA_CATALOG,
  VISA_REGIONS,
  type VisaDestination,
  type VisaRegion,
} from "../data/visa-destinations";

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96] as const;
const SERVICE_OPTIONS = [
  "All Services",
  "Tourist Visa",
  "Business Visa",
  "Student Visa",
  "Work Visa",
];

function filterDestinations(
  catalog: VisaDestination[],
  region: VisaRegion,
  query: string
): VisaDestination[] {
  const q = query.trim().toLowerCase();

  return catalog.filter((item) => {
    const matchesRegion = region === "ALL" || item.region === region;
    const matchesQuery =
      !q || item.country.toLowerCase().includes(q) || item.region.toLowerCase().includes(q);
    return matchesRegion && matchesQuery;
  });
}

/** Visa Processing Services catalog — grid page (Page 2 design) */
export default function VisaCatalogLayout() {
  const [activeRegion, setActiveRegion] = useState<VisaRegion>("Asia");
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceType, setServiceType] = useState(SERVICE_OPTIONS[0]);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("2");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(12);
  const [visibleCount, setVisibleCount] = useState(12);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const filtered = useMemo(
    () => filterDestinations(VISA_CATALOG, activeRegion, searchQuery),
    [activeRegion, searchQuery]
  );

  const displayTotal =
    activeRegion === "ALL" && !searchQuery.trim() ? TOTAL_VISA_RESULTS : filtered.length;

  const visibleItems = filtered.slice(0, visibleCount);
  const showingEnd = Math.min(visibleCount, displayTotal);
  const hasMore = visibleCount < displayTotal;

  const updateCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateCarouselScroll();
    const el = carouselRef.current;
    window.addEventListener("resize", updateCarouselScroll);
    el?.addEventListener("scroll", updateCarouselScroll);
    return () => {
      window.removeEventListener("resize", updateCarouselScroll);
      el?.removeEventListener("scroll", updateCarouselScroll);
    };
  }, [updateCarouselScroll]);

  const scrollCarousel = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.55) || 240;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const handleSearch = () => {
    setVisibleCount(pageSize);
    setSelectedId(null);
  };

  const handleRegionChange = (region: VisaRegion) => {
    setActiveRegion(region);
    setVisibleCount(pageSize);
    setSelectedId(null);
  };

  const handleLoadMore = () => {
    setVisibleCount((count) => Math.min(count + pageSize, displayTotal));
  };

  // Auto-load the next page when the sentinel below the grid scrolls into
  // view; the "More Results" button stays as a manual fallback.
  const loadMoreSentinelRef = useInfiniteScroll(handleLoadMore, { enabled: hasMore });

  const handlePageSizeChange = (size: (typeof PAGE_SIZE_OPTIONS)[number]) => {
    setPageSize(size);
    setVisibleCount(size);
    setPageSizeOpen(false);
  };

  return (
    <div className="font-sans text-sm">
      <section className="bg-[#f2efe9] px-4 py-6 md:py-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-5 md:mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1e1e40] mb-2 tracking-tight">
              OUR <span className="text-[#fbbb16]">VISA Processing</span> SERVICES
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-xs sm:text-sm leading-relaxed">
              We deliver innovative solutions in Information Technology and Civil Engineering,
              creating sustainable and efficient projects worldwide. Our expertise transforms
              industries and sets new standards for quality in visa processing support.
            </p>
          </div>

          <div className="flex justify-center mb-5 md:mb-6">
            <div className="flex w-full max-w-xl bg-card rounded-md shadow-sm overflow-hidden border border-border">
              <div className="relative border-r border-border">
                <button
                  type="button"
                  onClick={() => setServiceOpen((open) => !open)}
                  className="flex items-center gap-1.5 px-3 py-2 text-muted-foreground font-medium hover:bg-muted/60 transition-colors whitespace-nowrap text-xs sm:text-sm"
                >
                  {serviceType}
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                </button>
                {serviceOpen && (
                  <ul className="absolute left-0 top-full z-20 min-w-[160px] bg-card border border-border rounded-md shadow-lg py-0.5">
                    {SERVICE_OPTIONS.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          onClick={() => {
                            setServiceType(option);
                            setServiceOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-foreground/80 hover:bg-muted/60"
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search"
                className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-[#1e1e40] text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold hover:bg-[#141432] transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll regions left"
              className="w-8 h-8 shrink-0 bg-[#9ca3af] disabled:opacity-40 text-white rounded-full flex items-center justify-center hover:bg-[#6b7280] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div
              ref={carouselRef}
              className="flex-1 flex gap-2 overflow-x-auto pb-0.5 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {VISA_REGIONS.map((region) => {
                const isActive = activeRegion === region.label;
                return (
                  <button
                    key={region.label}
                    type="button"
                    onClick={() => handleRegionChange(region.label)}
                    className={`flex flex-col items-center justify-center min-w-[88px] sm:min-w-[100px] py-2 px-3 rounded-md shadow-sm border transition-colors shrink-0 ${
                      isActive
                        ? "bg-[#1e1e40] text-white border-[#1e1e40]"
                        : "bg-card text-foreground border-border hover:border-border"
                    }`}
                  >
                    {region.label !== "ALL" && (
                      <span
                        className={`text-sm font-bold leading-none ${
                          isActive ? "text-white" : "text-foreground"
                        }`}
                      >
                        {region.count}
                      </span>
                    )}
                    <span
                      className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${
                        isActive ? "text-gray-300" : "text-muted-foreground"
                      }`}
                    >
                      {region.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              disabled={!canScrollRight}
              aria-label="Scroll regions right"
              className="w-8 h-8 shrink-0 bg-black disabled:opacity-40 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#eef1ec] px-4 py-6 md:py-8">
        <div className="container mx-auto max-w-5xl">
          {visibleItems.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground shadow-sm">
              <p className="text-sm font-semibold text-foreground mb-1">No visa services found</p>
              <p className="text-xs">Try a different region or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
              {visibleItems.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`text-left rounded-md p-2.5 shadow-sm transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#1e1e40] border-[#1e1e40] text-white"
                        : "bg-card border-border hover:shadow-md hover:border-border"
                    }`}
                  >
                    <VisaStampImage selected={isSelected} />
                    <h3
                      className={`text-center font-semibold text-xs sm:text-sm mt-2 ${
                        isSelected ? "text-white" : "text-foreground"
                      }`}
                    >
                      {item.country}
                    </h3>
                  </button>
                );
              })}
            </div>
          )}

          <div ref={loadMoreSentinelRef} aria-hidden className="h-px" />

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Showing 1 to {showingEnd} of {displayTotal} Results
            </p>

            <div className="flex items-stretch rounded overflow-hidden shadow-sm text-xs">
              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="bg-[#1e1e40] text-white px-3 py-1.5 font-semibold flex items-center gap-1.5 hover:bg-[#141432] transition-colors"
                >
                  More Results
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPageSizeOpen((open) => !open)}
                  className="bg-[#1e1e40] text-white px-3 py-1.5 font-semibold border-l border-white/20 flex items-center gap-1 hover:bg-[#141432] transition-colors h-full"
                >
                  {pageSize}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {pageSizeOpen && (
                  <ul className="absolute bottom-full left-0 mb-1 min-w-full bg-card border border-border rounded-md shadow-lg py-0.5 z-10">
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <li key={size}>
                        <button
                          type="button"
                          onClick={() => handlePageSizeChange(size)}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-muted/60 ${
                            pageSize === size ? "text-[#1e1e40]" : "text-muted-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
