"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface SpinnerProps {
  /** Size of the spinner in pixels. Default: 24 */
  size?: number;
  /** Additional className */
  className?: string;
  /** Accessible label for screen readers. Default: "Loading…" */
  label?: string;
}

/**
 * Accessible loading spinner.
 *
 * Usage:
 *   <Spinner />
 *   <Spinner size={48} label="Fetching data…" />
 */
export function Spinner({ size = 24, className, label = "Loading…" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin text-primary"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeOpacity="0.25"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Full-page centered spinner overlay.
 */
export function PageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[200px] w-full items-center justify-center" role="status">
      <Spinner size={40} label={label} />
    </div>
  );
}

export default Spinner;
