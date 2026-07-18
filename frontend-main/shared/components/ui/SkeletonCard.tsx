"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Base skeleton shimmer element. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      aria-hidden="true"
    />
  );
}

/** Skeleton card matching the common card layout (image + title + meta). */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 space-y-3",
        className
      )}
      aria-busy="true"
      aria-label="Loading…"
    >
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-md" />
      {/* Title */}
      <Skeleton className="h-4 w-3/4" />
      {/* Subtitle */}
      <Skeleton className="h-3 w-1/2" />
      {/* Footer row */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** Skeleton for a table row. */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr aria-busy="true">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for a text block (multiple lines). */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)} aria-busy="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export default SkeletonCard;
