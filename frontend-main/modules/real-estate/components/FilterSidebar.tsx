"use client";

import { ChevronDown } from "lucide-react";
import type { RealEstateFilters } from "../types";
import { FILTER_OPTIONS } from "../data/mock-properties";

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
        className="w-full border border-border rounded px-3 py-2 text-sm text-foreground/80 bg-card hover:bg-muted/60 appearance-none outline-none cursor-pointer"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

function PriceRangeSlider({ min, max, valueMin, valueMax, onChange }: PriceRangeSliderProps) {
  const minPercent = ((valueMin - min) / (max - min)) * 100;
  const maxPercent = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="mt-4 px-1">
      <span className="text-xs font-bold text-foreground block mb-3">Price</span>
      <div className="relative w-full h-1 bg-muted rounded-full mb-3">
        <div
          className="absolute top-0 h-full bg-[#3b82f6] rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={(e) => onChange(Math.min(Number(e.target.value), valueMax - 1), valueMax)}
          className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={(e) => onChange(valueMin, Math.max(Number(e.target.value), valueMin + 1))}
          className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-foreground font-medium">
        <span>100</span>
        <span>200M</span>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  filters: RealEstateFilters;
  onChange: <K extends keyof RealEstateFilters>(key: K, value: RealEstateFilters[K]) => void;
  onPriceChange: (priceMin: number, priceMax: number) => void;
  onClear: () => void;
}

export function FilterSidebar({ filters, onChange, onPriceChange, onClear }: FilterSidebarProps) {
  return (
    <div className="w-full lg:w-[280px] shrink-0">
      <div className="bg-card border border-border p-4 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground text-sm">Filters</h3>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <FilterSelect
            label="Category"
            value={filters.category}
            onChange={(v) => onChange("category", v)}
            options={FILTER_OPTIONS.categories}
          />
          <FilterSelect
            label="Sub Category"
            value={filters.subCategory}
            onChange={(v) => onChange("subCategory", v)}
            options={FILTER_OPTIONS.subCategories}
          />
          <FilterSelect
            label="Current status"
            value={filters.currentStatus}
            onChange={(v) => onChange("currentStatus", v)}
            options={FILTER_OPTIONS.currentStatuses}
          />

          <div className="mt-2 mb-1">
            <span className="text-xs text-muted-foreground font-medium">Package Address</span>
          </div>

          <FilterSelect
            label="Country"
            value={filters.country}
            onChange={(v) => onChange("country", v)}
            options={FILTER_OPTIONS.countries}
          />
          <FilterSelect
            label="state"
            value={filters.state}
            onChange={(v) => onChange("state", v)}
            options={FILTER_OPTIONS.states}
          />
          <FilterSelect
            label="city"
            value={filters.city}
            onChange={(v) => onChange("city", v)}
            options={FILTER_OPTIONS.cities}
          />
          <FilterSelect
            label="zip code"
            value={filters.zip}
            onChange={(v) => onChange("zip", v)}
            options={FILTER_OPTIONS.zips}
          />

          <FilterSelect
            label="Duration"
            value={filters.duration}
            onChange={(v) => onChange("duration", v)}
            options={FILTER_OPTIONS.durations}
          />
          <FilterSelect
            label="Pick Up/Drop"
            value={filters.parking}
            onChange={(v) => onChange("parking", v)}
            options={FILTER_OPTIONS.parking}
          />
          <FilterSelect
            label="Travel Dates"
            value={filters.moveInDate}
            onChange={(v) => onChange("moveInDate", v)}
            options={FILTER_OPTIONS.moveInDates}
          />
          <FilterSelect
            label="Destination Country"
            value={filters.destinationRegion}
            onChange={(v) => onChange("destinationRegion", v)}
            options={FILTER_OPTIONS.destinationRegions}
          />

          <FilterSelect
            label="Tourist visa"
            value={filters.houseType}
            onChange={(v) => onChange("houseType", v)}
            options={FILTER_OPTIONS.houseTypes}
          />
          <FilterSelect
            label="Transit visa"
            value={filters.apartmentType}
            onChange={(v) => onChange("apartmentType", v)}
            options={FILTER_OPTIONS.apartmentTypes}
          />
          <FilterSelect
            label="Medical treatment visa"
            value={filters.commercialType}
            onChange={(v) => onChange("commercialType", v)}
            options={FILTER_OPTIONS.commercialTypes}
          />

          <FilterSelect
            label="Visa Category"
            value={filters.propertyClass}
            onChange={(v) => onChange("propertyClass", v)}
            options={FILTER_OPTIONS.propertyClasses}
          />
          <FilterSelect
            label="Package Category"
            value={filters.listingCategory}
            onChange={(v) => onChange("listingCategory", v)}
            options={FILTER_OPTIONS.listingCategories}
          />
          <FilterSelect
            label="Travel type"
            value={filters.transactionType}
            onChange={(v) => onChange("transactionType", v)}
            options={FILTER_OPTIONS.transactionTypes}
          />
          <FilterSelect
            label="Features"
            value={filters.features}
            onChange={(v) => onChange("features", v)}
            options={FILTER_OPTIONS.features}
          />

          <PriceRangeSlider
            min={100}
            max={200_000_000}
            valueMin={filters.priceMin}
            valueMax={filters.priceMax}
            onChange={onPriceChange}
          />
        </div>
      </div>
    </div>
  );
}
