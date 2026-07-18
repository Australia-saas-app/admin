"use client";

import type { VisaTravelListing } from "../types/travel";
import { useFormatMoney } from "@/src/shared/hooks/use-format-money";

const STATUS_STYLES: Record<VisaTravelListing["currentStatus"], string> = {
  Waiting: "border-[#93c5fd] text-[#3b82f6] bg-[#eff6ff]",
  Available: "border-[#86efac] text-[#16a34a] bg-[#f0fdf4]",
  Sold: "border-[#fca5a5] text-[#dc2626] bg-[#fef2f2]",
  Pending: "border-[#fcd34d] text-[#d97706] bg-[#fffbeb]",
};

interface VisaTravelCardProps {
  listing: VisaTravelListing;
  onSelect?: (listing: VisaTravelListing) => void;
}

export function VisaTravelCard({ listing, onSelect }: VisaTravelCardProps) {
  const { formatPrice } = useFormatMoney();
  const visibleFeatures = listing.features.slice(0, 4);
  const hiddenCount = listing.features.length - visibleFeatures.length;

  return (
    <article
      className="card-lift group flex h-[168px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      onClick={() => onSelect?.(listing)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect?.(listing)}
    >
      <div className="w-[38%] bg-muted relative shrink-0 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="w-[62%] p-2.5 flex flex-col relative text-[10px] min-w-0">
        <span
          className={`absolute top-2 right-2 border px-1.5 py-0.5 text-[9px] font-medium rounded ${STATUS_STYLES[listing.currentStatus]}`}
        >
          {listing.currentStatus}
        </span>

        <h3 className="text-primary font-medium text-[11px] mb-0.5 pr-14 truncate">
          {listing.title}
        </h3>
        <p className="text-foreground font-bold text-[10px] mb-0.5">
          {formatPrice(listing.price, listing.currency)}
        </p>

        {listing.travelClass && (
          <p className="text-muted-foreground mb-0.5">Class: {listing.travelClass}</p>
        )}
        {listing.passengers != null && (
          <p className="text-muted-foreground mb-0.5">Passengers: {listing.passengers}</p>
        )}

        <p className="text-muted-foreground mb-0.5">{listing.duration}</p>
        <p className="text-muted-foreground mb-0.5 line-clamp-1">
          Countries: {listing.countries.join(" | ")}
        </p>
        <p className="text-primary mb-0.5 line-clamp-1">
          {visibleFeatures.join(" | ")}
          {hiddenCount > 0 ? ` | ${hiddenCount} More` : ""}
        </p>

        <div className="flex flex-col gap-0.5 text-foreground/80 font-medium pt-1.5 mt-auto border-t border-gray-50 text-[9px]">
          <span className="truncate">Valid Till: {listing.validTill}</span>
          <span className="truncate">{listing.address}</span>
        </div>
      </div>
    </article>
  );
}
