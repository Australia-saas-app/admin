"use client";

import FormatDate from "@/src/utils/FormatDate";
import React from "react";

interface Props {
  images: any[];
  startIndex: number;
  fileType?: "image" | "video";
  onClose: () => void;
  title?: string;
  description?: string;
  createdAt?: string;
}

export default function GalleryViewer({
  images,
  startIndex,
  title,
  description,
  createdAt,
  fileType = "image",
  onClose,
}: Props) {
  const [index, setIndex] = React.useState(startIndex || 0);

  React.useEffect(() => {
    setIndex(startIndex || 0);
  }, [startIndex]);

  const prev = () => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = () => {
    setIndex((i) => (i + 1) % images.length);
  };

  const current = images[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-card w-[95%] md:w-[80%] lg:w-[70%] max-h-[90%] overflow-auto rounded shadow-lg relative">
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {createdAt && (
              <p className="text-xs text-muted-foreground">Created: {FormatDate(createdAt)}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="relative">
            {fileType === "video" ? (
              <video src={current.imageUrl} controls className="w-full max-h-[70vh] mx-auto" />
            ) : (
              <img
                src={current.imageUrl}
                alt={current.altText}
                className="w-full object-contain max-h-[70vh] mx-auto"
              />
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button className="btn btn-outline" onClick={prev}>
              Previous
            </button>
            <button className="btn btn-outline" onClick={next}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
