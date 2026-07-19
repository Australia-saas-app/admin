/**
 * Recently viewed items — persisted client-side in localStorage.
 *
 * Detail pages call `recordRecentlyViewed(...)` (via the <TrackView /> helper)
 * and listing/home surfaces read the history with `getRecentlyViewed()` or the
 * `useRecentlyViewed()` hook.
 */

export interface RecentlyViewedItem {
  id: string;
  /** Content type, e.g. "blog", "associate", "property". */
  type: string;
  title: string;
  href: string;
  image?: string;
  viewedAt: string;
}

const STORAGE_KEY = "sysdb.recently-viewed";
const MAX_ITEMS = 20;
const EVENT_NAME = "recently-viewed:change";

export function getRecentlyViewed(limit = MAX_ITEMS): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const items = raw ? (JSON.parse(raw) as RecentlyViewedItem[]) : [];
    return items.slice(0, limit);
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(item: Omit<RecentlyViewedItem, "viewedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const entry: RecentlyViewedItem = {
      ...item,
      viewedAt: new Date().toISOString(),
    };
    const existing = getRecentlyViewed().filter((i) => !(i.id === item.id && i.type === item.type));
    const next = [entry, ...existing].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // Storage unavailable — feature silently disabled.
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // ignore
  }
}

export function subscribeRecentlyViewed(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT_NAME, listener);
    window.removeEventListener("storage", listener);
  };
}
