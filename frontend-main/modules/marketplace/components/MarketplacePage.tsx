"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { PackageSearch, Search, ChevronDown, Star } from "lucide-react";
import { useCountryFilterEffect } from "@/src/shared/hooks/use-country-filter-effect";
import { useInfiniteScroll } from "@/src/shared/hooks/useInfiniteScroll";
import { recordRecentlyViewed } from "@/src/lib/recently-viewed";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { PublicDetailModal } from "@/src/modules/shared/components/public/PublicDetailModal";
import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { PublicContactModal } from "@/src/modules/shared/components/public/PublicContactModal";
import { useFormatMoney } from "@/src/shared/hooks/use-format-money";

// Simple deterministic pseudo-random generator
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

const FILTER_SECTIONS = [
  { label: "Category", options: ["All", "Electronics", "Books"] },
  { label: "Type", options: ["All", "1", "2", "3"] },
  { label: "Country", options: ["All", "canada", "japan"] },
  { label: "State", options: ["All", "canada"] },
  { label: "Status", options: ["All", "Active", "Completed", "Upcoming"] },
  {
    label: "Deadline",
    options: ["All", "Within 3 days", "Within 7 days", "Within 1 month", "Expired"],
  },
  { label: "Range", options: ["All", "0.00 - 300", "400 - 700", "800 - 1100", "1200 - 1500+"] },
];

const MOCK_PRODUCTS = Array.from({ length: 24 }).map((_, idx) => {
  const prng1 = pseudoRandom(idx * 10);
  const prng2 = pseudoRandom(idx * 20);

  const productTypes = [
    {
      title: "Apple iPhone 16 Pro",
      network: "Network 5G",
      ram: "RAM 8 GB",
      camera: "Camera 48 MP",
      weight: "Weight 200 g",
      img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80",
      cat: "Electronics",
    },
    {
      title: "MacBook Air M3",
      network: "Wi-Fi 6E",
      ram: "RAM 16 GB",
      camera: "1080p FaceTime HD",
      weight: "Weight 1.24 kg",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80",
      cat: "Electronics",
    },
    {
      title: "Sony WH-1000XM5",
      network: "Bluetooth 5.2",
      ram: "N/A",
      camera: "N/A",
      weight: "Weight 250 g",
      img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
      cat: "Electronics",
    },
    {
      title: "Advanced React patterns",
      network: "E-Book format",
      ram: "N/A",
      camera: "N/A",
      weight: "Digital",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80",
      cat: "Books",
    },
    {
      title: "Nikon D850 DSLR",
      network: "Wi-Fi / Bluetooth",
      ram: "N/A",
      camera: "45.7 MP FX",
      weight: "Weight 915 g",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",
      cat: "Electronics",
    },
    {
      title: "Designing Data-Intensive Applications",
      network: "Paperback",
      ram: "N/A",
      camera: "N/A",
      weight: "Weight 800 g",
      img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
      cat: "Books",
    },
  ];

  const typeInfo = productTypes[idx % productTypes.length];

  return {
    id: idx + 1,
    title: typeInfo.title,
    network: typeInfo.network,
    ram: typeInfo.ram,
    camera: typeInfo.camera,
    weight: typeInfo.weight,
    condition: idx % 4 === 0 ? "Used" : "New",
    price: (Math.floor(prng1 * 900) + 50).toString(),
    oldPrice: (Math.floor(prng1 * 900) + 150).toString(),
    rating: Math.floor(prng2 * 2) + 3, // 3 to 4
    image: typeInfo.img,
    category: typeInfo.cat,
    type: (idx % 3) + 1,
    country: idx % 2 === 0 ? "canada" : "japan",
  };
});

export default function MarketplacePage() {
  const { formatUsd } = useFormatMoney();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState("All");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const [limit, setLimit] = useState(12);
  const [isLimitDropdownOpen, setIsLimitDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof MOCK_PRODUCTS)[number] | null>(
    null
  );
  const [contactOpen, setContactOpen] = useState(false);

  useCountryFilterEffect("marketplace", (value) => {
    setActiveFilters((prev) => ({ ...prev, Country: value ?? "All" }));
  });

  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      if (activeSearch && !product.title.toLowerCase().includes(activeSearch.toLowerCase())) {
        return false;
      }
      if (
        activeFilters["Category"] &&
        activeFilters["Category"] !== "All" &&
        product.category !== activeFilters["Category"]
      )
        return false;
      if (
        activeFilters["Country"] &&
        activeFilters["Country"] !== "All" &&
        product.country !== activeFilters["Country"]
      )
        return false;
      return true;
    });
  }, [activeSearch, activeFilters]);

  const displayedProducts = filteredProducts.slice(0, limit);
  const totalResults = filteredProducts.length;
  const hasMore = limit < totalResults;

  const handleMoreResults = () => {
    setLimit((prev) => Math.min(prev + 12, totalResults));
  };

  const loadMoreSentinelRef = useInfiniteScroll(handleMoreResults, { enabled: hasMore });

  useEffect(() => {
    if (!selectedProduct) return;
    recordRecentlyViewed({
      id: String(selectedProduct.id),
      type: "product",
      title: selectedProduct.title,
      href: `/marketplace?product=${selectedProduct.id}`,
      image: selectedProduct.image,
    });
  }, [selectedProduct]);

  return (
    <PublicPageShell
      title="Marketplace"
      subtitle="Browse electronics, books, and professional listings from verified sellers worldwide."
      badge="Shop"
    >
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mb-8 relative">
          <div className="flex items-center bg-card border border-border rounded-md overflow-hidden shadow-sm h-[46px] w-full max-w-2xl z-20">
            <div className="relative h-full flex items-center">
              <button
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                className="flex items-center px-4 bg-card border-r border-border text-[13px] text-primary min-w-[90px] justify-between cursor-pointer hover:bg-muted/60 h-full font-medium"
              >
                {searchFilter} <ChevronDown className="w-4 h-4 ml-2 text-primary" />
              </button>
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[120px] bg-card shadow-lg border border-border rounded-md py-1 z-50">
                  {["All", "Used", "Unused"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setSearchFilter(opt);
                        setIsSearchDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-[12px] text-foreground/80 hover:bg-blue-50 hover:text-blue-600 cursor-pointer font-medium"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 text-[13px] text-foreground focus:outline-none min-w-0 h-full"
            />
            <button
              onClick={handleSearch}
              className="bg-primary text-white w-[52px] h-full flex items-center justify-center hover:bg-[#1a365d] transition-colors shrink-0"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="lg:absolute lg:right-0 h-[46px] flex items-center z-10 w-full lg:w-auto justify-end">
            <button className="bg-card border border-border text-foreground/80 font-semibold py-2 px-6 rounded-md text-[13px] transition-colors shadow-sm h-full hover:bg-muted/60">
              Add Product
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 relative z-10">
          {FILTER_SECTIONS.map((section) => (
            <div key={section.label} className="relative group">
              <div className="flex items-center bg-card border border-border rounded-md py-2.5 px-4 text-[13px] font-medium text-muted-foreground cursor-pointer hover:bg-muted/60 shadow-sm min-w-[125px] justify-between">
                <span>
                  {activeFilters[section.label] && activeFilters[section.label] !== "All"
                    ? activeFilters[section.label]
                    : section.label}
                </span>
                <ChevronDown className="w-4 h-4 ml-2 text-muted-foreground/70" />
              </div>
              <select
                value={activeFilters[section.label] || ""}
                onChange={(e) =>
                  setActiveFilters({ ...activeFilters, [section.label]: e.target.value })
                }
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                <option value="">{section.label}</option>
                {section.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl overflow-hidden card-lift shadow-sm border border-border flex flex-col cursor-pointer"
                onClick={() => setSelectedProduct(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedProduct(item)}
              >
                <div className="aspect-[4/3] bg-muted/40 relative overflow-hidden border-b border-border">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-primary font-bold text-[14px] mb-3">{item.title}</h3>

                  <div className="text-[11px] text-muted-foreground space-y-1.5 mb-5 font-medium leading-relaxed">
                    <div>{item.network}</div>
                    <div>{item.ram}</div>
                    <div>{item.camera}</div>
                    <div>{item.weight}</div>
                    <div className="text-red-500 font-semibold mt-1">{item.condition}</div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < item.rating ? "fill-current" : "text-gray-200 fill-current"}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-primary font-bold text-[13px]">
                        {formatUsd(Number(item.price))}
                      </span>
                      <span className="text-muted-foreground/70 line-through text-[11px] font-semibold">
                        {formatUsd(Number(item.oldPrice))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={<PackageSearch className="h-8 w-8" />}
                title="No products found"
                description="Try another search or clear your filters to see more listings."
              />
            </div>
          )}
        </div>

        <div ref={loadMoreSentinelRef} aria-hidden className="h-px" />

        {/* Pagination Container matching Careers exactly */}
        <div className="flex flex-col items-center justify-center pb-6 px-4">
          <div className="text-[11px] font-bold text-muted-foreground mb-2">
            Showing {totalResults === 0 ? 0 : 1} To {Math.min(limit, totalResults)} of{" "}
            {totalResults} Results
          </div>

          <div className="flex items-center gap-0 bg-primary rounded overflow-hidden shadow-sm h-8">
            <button
              onClick={handleMoreResults}
              disabled={!hasMore}
              className="px-4 text-xs font-semibold text-white bg-primary hover:bg-[#1a365d] transition-colors border-r border-[#3a5375] h-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              More Results
            </button>

            <div className="relative h-full z-20">
              <button
                onClick={() => setIsLimitDropdownOpen(!isLimitDropdownOpen)}
                className="flex items-center px-3 text-xs font-semibold text-white bg-primary hover:bg-[#1a365d] transition-colors h-full"
              >
                {limit} <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-80" />
              </button>
              {isLimitDropdownOpen && (
                <div className="absolute bottom-full right-0 mt-1 mb-1 bg-card shadow-lg border border-border rounded-md w-[60px] py-1 text-center">
                  {[12, 24, 48, 96].map((num) => (
                    <div
                      key={num}
                      onClick={() => {
                        setLimit(num);
                        setIsLimitDropdownOpen(false);
                      }}
                      className="text-[11px] text-muted-foreground py-1.5 hover:bg-muted/60 hover:text-blue-600 cursor-pointer font-medium"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside overlays */}
      {isLimitDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsLimitDropdownOpen(false)}></div>
      )}
      {isSearchDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsSearchDropdownOpen(false)}></div>
      )}

      <PublicDetailModal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.title ?? "Product"}
        subtitle={
          selectedProduct ? `${selectedProduct.category} · ${selectedProduct.condition}` : undefined
        }
        fields={
          selectedProduct
            ? [
                { label: "Price", value: formatUsd(Number(selectedProduct.price)) },
                { label: "Condition", value: selectedProduct.condition },
                { label: "Network", value: selectedProduct.network },
                { label: "RAM", value: selectedProduct.ram },
                { label: "Camera", value: selectedProduct.camera },
                { label: "Weight", value: selectedProduct.weight },
                { label: "Rating", value: `${selectedProduct.rating} stars` },
              ]
            : []
        }
        footer={
          selectedProduct && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setContactOpen(true);
                }}
              >
                Contact seller
              </Button>
            </div>
          )
        }
      />
      <PublicContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Contact seller"
        description="Send an inquiry about this listing. Our team will connect you with the seller."
        subject={selectedProduct ? `Inquiry: ${selectedProduct.title}` : ""}
      />
    </PublicPageShell>
  );
}
