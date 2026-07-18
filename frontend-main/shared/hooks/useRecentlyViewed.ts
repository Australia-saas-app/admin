"use client";

import { useEffect, useState } from "react";
import {
  getRecentlyViewed,
  subscribeRecentlyViewed,
  type RecentlyViewedItem,
} from "@/src/lib/recently-viewed";

/** Live view of the recently-viewed history (updates across tabs too). */
export function useRecentlyViewed(limit = 8): RecentlyViewedItem[] {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    const refresh = () => setItems(getRecentlyViewed(limit));
    refresh();
    return subscribeRecentlyViewed(refresh);
  }, [limit]);

  return items;
}
