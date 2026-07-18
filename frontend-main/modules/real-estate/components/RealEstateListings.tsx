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
import { EmptyState } from "@/src/components/ui/EmptyState";
import { FilterSidebar } from "./FilterSidebar";
import { PropertyCard } from "./PropertyCard";
import { MOCK_PROPERTIES, formatResultCount, TOTAL_CATALOG_SIZE } from "../data/mock-properties";
import { DEFAULT_FILTERS, type Property, type RealEstateFilters, type SortOption } from "../types";

const PAGE_SIZE = 12;

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

function filterProperties(
  properties: Property[],
  search: string,
  filters: RealEstateFilters
): Property[] {
  const query = search.trim().toLowerCase();

  return properties.filter((p) => {
    const addressBlob =
      `${p.street} ${p.city} ${p.state} ${p.zip} ${p.country} ${p.title} ${p.nearbyAreas.join(" ")}`.toLowerCase();

    if (query && !addressBlob.includes(query)) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.subCategory && p.subCategory !== filters.subCategory) return false;
    if (filters.currentStatus && p.currentStatus !== filters.currentStatus) return false;
    if (filters.country && p.country !== filters.country) return false;
    if (filters.state && p.state !== filters.state) return false;
    if (filters.city && p.city !== filters.city) return false;
    if (filters.zip && p.zip !== filters.zip) return false;
    if (filters.duration && p.duration !== filters.duration) return false;
    if (filters.parking && p.parking !== filters.parking) return false;
    if (filters.moveInDate && p.moveInDate !== filters.moveInDate) return false;
    if (filters.destinationRegion && p.destinationRegion !== filters.destinationRegion)
      return false;
    if (filters.propertyClass && p.propertyClass !== filters.propertyClass) return false;
    if (filters.listingCategory && p.listingCategory !== filters.listingCategory) return false;
    if (filters.transactionType && p.transactionType !== filters.transactionType) return false;
    if (!matchesMin(p.beds, filters.beds, 6)) return false;
    if (!matchesMin(p.baths, filters.bathroom, 4)) return false;
    if (!matchesMin(p.kitchens, filters.kitchen, 2)) return false;
    if (!matchesSizeRange(p.sqFt, filters.sizeRange)) return false;
    if (filters.features && !p.features.includes(filters.features)) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;

    if (filters.houseType && p.propertyType !== "House" && p.propertyType !== "Villa") return false;
    if (filters.apartmentType && p.propertyType !== "Apartment" && p.propertyType !== "Condo")
      return false;
    if (filters.commercialType && p.subCategory !== "Commercial") return false;

    return true;
  });
}

function sortProperties(properties: Property[], sortBy: SortOption): Property[] {
  const sorted = [...properties];

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

export default function RealEstateListings() {
  const { formatUsd } = useFormatMoney();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<RealEstateFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("Oldest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useCountryFilterEffect("realEstate", (value) => {
    setFilters((prev) => ({ ...prev, country: value ?? "" }));
    setCurrentPage(1);
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredProperties = useMemo(
    () => sortProperties(filterProperties(MOCK_PROPERTIES, debouncedSearch, filters), sortBy),
    [debouncedSearch, filters, sortBy]
  );

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filteredProperties.length);
  const paginatedProperties = filteredProperties.slice(pageStart, pageEnd);

  const displayTotal =
    debouncedSearch.trim() === "" &&
    Object.entries(filters).every(([key, val]) => {
      if (key === "priceMin") return val === DEFAULT_FILTERS.priceMin;
      if (key === "priceMax") return val === DEFAULT_FILTERS.priceMax;
      return val === "";
    })
      ? TOTAL_CATALOG_SIZE
      : filteredProperties.length;

  const updateFilter = <K extends keyof RealEstateFilters>(key: K, value: RealEstateFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePriceChange = (priceMin: number, priceMax: number) => {
    setFilters((prev) => ({ ...prev, priceMin, priceMax }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters(DEFAULT_FILTERS);
    setSortBy("Oldest");
    setCurrentPage(1);
  };

  const paginationPages = getPaginationPages(safePage, totalPages);

  return (
    <PublicPageShell
      title="Real Estate"
      subtitle="Browse residential, commercial, and rental listings with advanced filters and verified listings."
      badge="Properties"
      action={
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/account/business/registration">List a property</Link>
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center w-full lg:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            onKeyDown={(e) => e.key === "Enter" && setCurrentPage(1)}
            placeholder="Address, neighborhood, city, zip code"
            className="flex-1 border border-border rounded-l-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className="bg-primary hover:bg-primary/90 transition-colors text-white px-4 py-2 rounded-r-md flex items-center justify-center"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <FilterSidebar
          filters={filters}
          onChange={updateFilter}
          onPriceChange={handlePriceChange}
          onClear={handleClearFilters}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-card border border-border p-3 rounded-md shadow-sm mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-medium text-foreground">
              Top results{" "}
              {filteredProperties.length > 0
                ? `${pageStart + 1}-${pageEnd} of ${formatResultCount(displayTotal)}`
                : "0 of 0"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-foreground">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    setCurrentPage(1);
                  }}
                  className="border border-border rounded px-3 py-1.5 text-xs text-foreground/80 bg-card hover:bg-muted/60 outline-none appearance-none pr-8 cursor-pointer"
                >
                  <option value="Oldest">Oldest</option>
                  <option value="Newest">Newest</option>
                  <option value="Lowest Price">Lowest Price</option>
                  <option value="Highest Price">Highest Price</option>
                </select>
                <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {paginatedProperties.length === 0 ? (
            <EmptyState
              icon={<Search className="h-8 w-8" />}
              title="No properties found"
              description="Try adjusting your filters or search query."
              action={
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Clear Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {paginatedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={setSelectedProperty}
                />
              ))}
            </div>
          )}

          {paginatedProperties.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-foreground">
                Showing {pageStart + 1} To {pageEnd} of {filteredProperties.length} Results
              </span>
              <div className="flex items-center shadow-sm rounded-md overflow-hidden border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-2.5 py-1.5 bg-primary text-white hover:bg-primary/90 border-r border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {paginationPages.map((page, idx) =>
                  page === "ellipsis" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1.5 text-[11px] text-muted-foreground border-r border-border"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 text-[11px] font-medium border-r border-border transition-colors ${
                        safePage === page
                          ? "bg-primary text-white"
                          : "bg-primary/80 text-white hover:bg-primary/90"
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
                  className="px-2.5 py-1.5 bg-[#4f6484] text-white hover:bg-[#3f5271] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PublicDetailModal
        open={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title={selectedProperty?.title ?? "Property"}
        subtitle={
          selectedProperty ? `${selectedProperty.city}, ${selectedProperty.country}` : undefined
        }
        fields={
          selectedProperty
            ? [
                {
                  label: "Price",
                  value:
                    selectedProperty.category === "Rent"
                      ? `${formatUsd(selectedProperty.price)} /mo`
                      : formatUsd(selectedProperty.price),
                },
                { label: "Status", value: selectedProperty.currentStatus },
                { label: "Type", value: selectedProperty.propertyType },
                {
                  label: "Beds / Baths",
                  value: `${selectedProperty.beds} bed · ${selectedProperty.baths} bath`,
                },
                { label: "Size", value: `${selectedProperty.sqFt} sq ft` },
                { label: "Address", value: `${selectedProperty.street}, ${selectedProperty.city}` },
                { label: "Features", value: selectedProperty.features.join(", ") },
              ]
            : []
        }
        footer={
          selectedProperty && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedProperty(null)}>
                Close
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setInquiryOpen(true)}
              >
                Request viewing
              </Button>
            </div>
          )
        }
      />
      <PublicContactModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        title="Property inquiry"
        description="Tell us when you'd like to schedule a viewing or request more details."
        subject={selectedProperty ? `Inquiry: ${selectedProperty.title}` : "Property inquiry"}
      />
    </PublicPageShell>
  );
}
