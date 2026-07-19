"use client";

import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  /** Whether more items can be loaded. */
  enabled: boolean;
  /** Distance from the sentinel at which loading starts. */
  rootMargin?: string;
}

/**
 * IntersectionObserver-based infinite scroll. Attach the returned ref to a
 * sentinel element below the list; `onLoadMore` fires when it scrolls into view.
 *
 * Usage:
 *   const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore });
 *   ...
 *   <div ref={sentinelRef} aria-hidden />
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  { enabled, rootMargin = "400px 0px" }: UseInfiniteScrollOptions
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          callbackRef.current();
        }
      },
      { rootMargin }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}
