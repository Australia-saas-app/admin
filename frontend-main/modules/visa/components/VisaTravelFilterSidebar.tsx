"use client";

import { ChevronDown } from "lucide-react";
import type { VisaTravelFilters } from "../types/travel";
import { VISA_TRAVEL_FILTER_OPTIONS } from "../data/mock-travel-listings";

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded px-2.5 py-1.5 text-xs text-foreground/80 bg-card hover:bg-muted/60 appearance-none outline-none cursor-pointer"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

interface VisaTravelFilterSidebarProps {
  filters: VisaTravelFilters;
  onChange: <K extends keyof VisaTravelFilters>(key: K, value: VisaTravelFilters[K]) => void;
  onPriceChange: (priceMin: number, priceMax: number) => void;
  onClear: () => void;
}

export function VisaTravelFilterSidebar({
  filters,
  onChange,
  onPriceChange,
  onClear,
}: VisaTravelFilterSidebarProps) {
  const minPercent = ((filters.priceMin - 100) / (20000000 - 100)) * 100;
  const maxPercent = ((filters.priceMax - 100) / (20000000 - 100)) * 100;

  return (
    <aside className="w-full lg:w-[240px] shrink-0">
      <div className="bg-card border border-border p-3 rounded-md shadow-sm lg:sticky lg:top-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground text-xs">Filters</h3>
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <FilterSelect
            label="Property Type"
            value={filters.propertyType}
            onChange={(v) => onChange("propertyType", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.propertyTypes}
          />
          <FilterSelect
            label="Property status"
            value={filters.propertyStatus}
            onChange={(v) => onChange("propertyStatus", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.propertyStatuses}
          />
          <FilterSelect
            label="Current status"
            value={filters.currentStatus}
            onChange={(v) => onChange("currentStatus", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.currentStatuses}
          />
          <FilterSelect
            label="Property Address"
            value={filters.address}
            onChange={(v) => onChange("address", v)}
            options={["7843 E Valley View Rd", "123 Ocean Drive", "200 Skyline Blvd"]}
          />
          <FilterSelect
            label="Country"
            value={filters.country}
            onChange={(v) => onChange("country", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.countries}
          />
          <FilterSelect
            label="state"
            value={filters.state}
            onChange={(v) => onChange("state", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.states}
          />
          <FilterSelect
            label="city"
            value={filters.city}
            onChange={(v) => onChange("city", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.cities}
          />
          <FilterSelect
            label="zip code"
            value={filters.zipCode}
            onChange={(v) => onChange("zipCode", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.zipCodes}
          />
          <FilterSelect
            label="Beds"
            value={filters.beds}
            onChange={(v) => onChange("beds", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.beds}
          />
          <FilterSelect
            label="Bathroom"
            value={filters.bathroom}
            onChange={(v) => onChange("bathroom", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.bathrooms}
          />
          <FilterSelect
            label="Kitchen"
            value={filters.kitchen}
            onChange={(v) => onChange("kitchen", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.kitchens}
          />
          <FilterSelect
            label="Size/Square Feet"
            value={filters.sizeRange}
            onChange={(v) => onChange("sizeRange", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.sizeRanges}
          />
          <FilterSelect
            label="Features"
            value={filters.features}
            onChange={(v) => onChange("features", v)}
            options={VISA_TRAVEL_FILTER_OPTIONS.features}
          />
        </div>

        <div className="mt-3 px-0.5">
          <span className="text-[10px] font-bold text-foreground block mb-2">Price</span>
          <div className="relative w-full h-1 bg-muted rounded-full mb-2">
            <div
              className="absolute top-0 h-full bg-[#3b82f6] rounded-full"
              style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
            />
            <input
              type="range"
              min={100}
              max={20000000}
              value={filters.priceMin}
              onChange={(e) =>
                onPriceChange(
                  Math.min(Number(e.target.value), filters.priceMax - 1),
                  filters.priceMax
                )
              }
              className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <input
              type="range"
              min={100}
              max={20000000}
              value={filters.priceMax}
              onChange={(e) =>
                onPriceChange(
                  filters.priceMin,
                  Math.max(Number(e.target.value), filters.priceMin + 1)
                )
              }
              className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-foreground font-medium">
            <span>100</span>
            <span>200M</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
