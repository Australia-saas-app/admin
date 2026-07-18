"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useCountryFilterEffect } from "@/src/shared/hooks/use-country-filter-effect";
import { useFormatMoney } from "@/src/shared/hooks/use-format-money";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { PublicDetailModal } from "@/src/modules/shared/components/public/PublicDetailModal";
import { PublicContactModal } from "@/src/modules/shared/components/public/PublicContactModal";
import { Button } from "@/src/components/ui/button";
import { VisaTravelFilterSidebar } from "./VisaTravelFilterSidebar";
import { VisaTravelCard } from "./VisaTravelCard";
import {
  MOCK_VISA_TRAVEL_LISTINGS,
  TOTAL_VISA_TRAVEL_RESULTS,
  formatTravelResultCount,
} from "../data/mock-travel-listings";
import {
  DEFAULT_VISA_TRAVEL_FILTERS,
  type VisaTravelFilters,
  type VisaTravelListing,
  type VisaTravelSort,
} from "../types/travel";

const PAGE_SIZE = 20;

function matchesSizeRange(sqFt: number, range: string): boolean {
  if (!range) return true;
  if (range === "< 1000") return sqFt < 1000;
  if (range === "1000-2000") return sqFt >= 1000 && sqFt <= 2000;
  if (range === "2000-4000") return sqFt >= 2000 && sqFt <= 4000;
  if (range === "4000+") return sqFt > 4000;
  return true;
}

function matchesMin(value: number, filter: string, plusThreshold?: number): boolean {
  if (!filter) return true;
  if (filter.endsWith("+") && plusThreshold) return value >= plusThreshold;
  return value >= parseInt(filter, 10);
}

function filterListings(
  listings: VisaTravelListing[],
  search: string,
  filters: VisaTravelFilters
): VisaTravelListing[] {
  const query = search.trim().toLowerCase();

  return listings.filter((item) => {
    const blob =
      `${item.title} ${item.address} ${item.countries.join(" ")} ${item.city} ${item.country}`.toLowerCase();
    if (query && !blob.includes(query)) return false;
    if (filters.propertyType && item.propertyType !== filters.propertyType) return false;
    if (filters.propertyStatus && item.propertyStatus !== filters.propertyStatus) return false;
    if (filters.currentStatus && item.currentStatus !== filters.currentStatus) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (filters.state && item.state !== filters.state) return false;
    if (filters.city && item.city !== filters.city) return false;
    if (filters.zipCode && item.zipCode !== filters.zipCode) return false;
    if (filters.features && !item.features.includes(filters.features)) return false;
    if (!matchesMin(item.beds, filters.beds, 6)) return false;
    if (!matchesMin(item.bathroom, filters.bathroom, 4)) return false;
    if (!matchesMin(item.kitchen, filters.kitchen, 2)) return false;
    if (!matchesSizeRange(item.sqFt, filters.sizeRange)) return false;
    if (item.price < filters.priceMin || item.price > filters.priceMax) return false;
    return true;
  });
}

function sortListings(listings: VisaTravelListing[], sortBy: VisaTravelSort): VisaTravelListing[] {
  const sorted = [...listings];
  switch (sortBy) {
    case "Lowest Price":
      return sorted.sort((a, b) => a.price - b.price);
    case "Highest Price":
      return sorted.sort((a, b) => b.price - a.price);
    case "Newest":
      return sorted.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    case "Oldest":
    default:
      return sorted.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
  }
}

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

export default function VisaTravelListings() {
  const { formatPrice } = useFormatMoney();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<VisaTravelFilters>(DEFAULT_VISA_TRAVEL_FILTERS);
  const [sortBy, setSortBy] = useState<VisaTravelSort>("Oldest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedListing, setSelectedListing] = useState<VisaTravelListing | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useCountryFilterEffect("visaTravel", (value) => {
    setFilters((prev) => ({ ...prev, country: value ?? "" }));
    setCurrentPage(1);
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filtered = useMemo(
    () => sortListings(filterListings(MOCK_VISA_TRAVEL_LISTINGS, debouncedSearch, filters), sortBy),
    [debouncedSearch, filters, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const pageItems = filtered.slice(pageStart, pageEnd);

  const displayTotal =
    debouncedSearch.trim() === "" &&
    Object.entries(filters).every(([key, val]) => {
      if (key === "priceMin") return val === DEFAULT_VISA_TRAVEL_FILTERS.priceMin;
      if (key === "priceMax") return val === DEFAULT_VISA_TRAVEL_FILTERS.priceMax;
      return val === "";
    })
      ? TOTAL_VISA_TRAVEL_RESULTS
      : filtered.length;

  const updateFilter = <K extends keyof VisaTravelFilters>(key: K, value: VisaTravelFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilters(DEFAULT_VISA_TRAVEL_FILTERS);
    setSortBy("Oldest");
    setCurrentPage(1);
  };

  const paginationPages = getPaginationPages(safePage, totalPages);

  return (
    <PublicPageShell
      title="Visa & Travel"
      subtitle="Explore visa assistance, travel packages, and relocation services from verified partners."
      badge="Travel"
      action={
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/account/business/registration">List a package</Link>
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-5">
        <div className="flex items-center w-full lg:max-w-md lg:ml-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onKeyDown={(e) => e.key === "Enter" && setCurrentPage(1)}
            placeholder="Search packages, destinations, visa services"
            className="flex-1 border border-border rounded-l-md px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className="bg-primary hover:bg-primary/90 transition-colors text-white px-3 py-1.5 rounded-r-md flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <VisaTravelFilterSidebar
          filters={filters}
          onChange={updateFilter}
          onPriceChange={(priceMin, priceMax) => {
            setFilters((prev) => ({ ...prev, priceMin, priceMax }));
            setCurrentPage(1);
          }}
          onClear={handleClear}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-card border border-border p-2.5 rounded-md shadow-sm mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-foreground">
              Top results{" "}
              {filtered.length > 0
                ? `${pageStart + 1}-${pageEnd} of ${formatTravelResultCount(displayTotal)}`
                : "0 of 0"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-foreground">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as VisaTravelSort);
                    setCurrentPage(1);
                  }}
                  className="border border-border rounded px-2.5 py-1 text-[11px] text-foreground/80 bg-card hover:bg-muted/60 outline-none appearance-none pr-7 cursor-pointer"
                >
                  <option value="Oldest">Oldest</option>
                  <option value="Newest">Newest</option>
                  <option value="Lowest Price">Lowest Price</option>
                  <option value="Highest Price">Highest Price</option>
                </select>
                <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <div className="bg-card border border-border rounded-md p-8 text-center text-muted-foreground shadow-sm">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No listings found</p>
              <p className="text-xs">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {pageItems.map((listing) => (
                <VisaTravelCard key={listing.id} listing={listing} onSelect={setSelectedListing} />
              ))}
            </div>
          )}

          {pageItems.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-foreground">
                Showing {pageStart + 1} To {pageEnd} of {filtered.length} Results
              </span>
              <div className="flex items-center shadow-sm rounded-md overflow-hidden border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-2 py-1 bg-[#4f6484] text-white hover:bg-[#3f5271] border-r border-border transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {paginationPages.map((page, idx) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1 text-[10px] text-muted-foreground border-r border-border"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`px-2.5 py-1 text-[10px] font-medium border-r border-border transition-colors ${
                        safePage === page
                          ? "bg-[#3b82f6] text-white"
                          : "bg-[#4f6484] text-white hover:bg-[#3f5271]"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="px-2 py-1 bg-[#4f6484] text-white hover:bg-[#3f5271] transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PublicDetailModal
        open={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title={selectedListing?.title ?? "Package"}
        subtitle={
          selectedListing ? `${selectedListing.city}, ${selectedListing.country}` : undefined
        }
        fields={
          selectedListing
            ? [
                {
                  label: "Price",
                  value: formatPrice(selectedListing.price, selectedListing.currency),
                },
                { label: "Status", value: selectedListing.currentStatus },
                { label: "Duration", value: selectedListing.duration },
                { label: "Countries", value: selectedListing.countries.join(", ") },
                { label: "Features", value: selectedListing.features.join(", ") },
                { label: "Valid till", value: selectedListing.validTill },
              ]
            : []
        }
        footer={
          selectedListing && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedListing(null)}>
                Close
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setInquiryOpen(true)}
              >
                Request quote
              </Button>
            </div>
          )
        }
      />
      <PublicContactModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        title="Visa & travel inquiry"
        description="Tell us your destination and travel dates."
        subject={selectedListing ? `Inquiry: ${selectedListing.title}` : "Visa & travel inquiry"}
      />
    </PublicPageShell>
  );
}
