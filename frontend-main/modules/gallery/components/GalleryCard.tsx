"use client";

import { formatDateShort } from "@/src/shared/utils/formatters";

interface GalleryItem {
  id: string;
  categoryName: string;
  description: string;
  createdAt: string;
  images: { imageUrl: string; altText: string }[];
}

export default function GalleryCard({
  id,
  categoryName,
  description,
  createdAt,
  images,
  onOpen,
}: GalleryItem & { onOpen?: () => void }) {
  return (
    <div className="card-lift group overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={onOpen}
        className="relative block h-44 w-full focus:outline-none md:h-56"
        aria-label={categoryName || `Gallery item ${id}`}
      >
        <img
          src={images[0]?.imageUrl}
          alt={images[0]?.altText || "gallery"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </button>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold text-foreground">{categoryName || "Untitled"}</h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {description || "No description available."}
        </p>
        {createdAt && (
          <p className="text-xs text-muted-foreground/80">
            Created on: {formatDateShort(createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
