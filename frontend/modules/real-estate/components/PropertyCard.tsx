"use client";

import Image from "next/image";
import type { Property } from "../types";
import { formatPostedLabel } from "../data/mock-properties";
import { useFormatMoney } from "@/src/shared/hooks/use-format-money";

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

const STATUS_STYLES: Record<Property["currentStatus"], string> = {
  Waiting: "border-[#93c5fd] text-[#3b82f6] bg-[#eff6ff]",
  Available: "border-[#86efac] text-[#16a34a] bg-[#f0fdf4]",
  Sold: "border-[#fca5a5] text-[#dc2626] bg-[#fef2f2]",
  Pending: "border-[#fcd34d] text-[#d97706] bg-[#fffbeb]",
};

export function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const { formatUsd } = useFormatMoney();
  const visibleFeatures = property.features.slice(0, 5);
  const hiddenCount = property.features.length - visibleFeatures.length;
  const priceLabel =
    property.category === "Rent" ? `${formatUsd(property.price)} /mo` : formatUsd(property.price);

  return (
    <div
      className="card-lift group flex h-[180px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      onClick={() => onSelect?.(property)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(property)}
    >
      <div className="w-[40%] bg-muted relative shrink-0 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 1280px) 40vw, 200px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="w-[60%] p-3 flex flex-col relative text-[10px] min-w-0">
        <span
          className={`absolute top-2 right-2 border px-2 py-0.5 text-[10px] font-medium rounded ${STATUS_STYLES[property.currentStatus]}`}
        >
          {property.currentStatus}
        </span>

        <h3 className="text-primary font-medium text-[12px] mb-0.5 pr-16 truncate">
          {property.title}
        </h3>
        <p className="text-foreground font-bold text-[11px] mb-1">{priceLabel}</p>

        <p className="text-muted-foreground mb-0.5">{property.duration}</p>
        <p className="text-muted-foreground mb-0.5 line-clamp-1">
          Countries : {property.nearbyAreas.join(" | ")}
        </p>
        <p className="text-primary mb-1 line-clamp-1">
          {visibleFeatures.join(" | ")}
          {hiddenCount > 0 ? ` | ${hiddenCount} More` : ""}
        </p>

        <div className="flex flex-col gap-0.5 text-foreground/80 font-medium pt-2 mt-auto border-t border-gray-50 text-[9px]">
          <span className="truncate">Valid Till: {property.validTill}</span>
          <span className="truncate">
            Travel Time: {property.duration} | {formatPostedLabel(property.postedDaysAgo)}
          </span>
        </div>
      </div>
    </div>
  );
}
