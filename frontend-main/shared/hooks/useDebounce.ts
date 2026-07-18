"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Debounce a rapidly-changing value.
 * Returns the value only after `delay` ms of inactivity.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchInput, 400);
 *   // Use debouncedSearch in API calls to avoid firing on every keystroke
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a stable debounced version of a callback function.
 * The callback is only invoked after `delay` ms without being called again.
 *
 * Usage:
 *   const handleSearch = useDebouncedCallback((query: string) => {
 *     fetchResults(query);
 *   }, 400);
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 400
): (...args: Args) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Keep the ref up-to-date without recreating the debounced function
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return (...args: Args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
}

/**
 * Throttle hook – fires at most once per `limit` ms.
 *
 * Usage:
 *   const throttled = useThrottle(scrollPosition, 100);
 */
export function useThrottle<T>(value: T, limit = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdated.current >= limit) {
      setThrottledValue(value);
      lastUpdated.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastUpdated.current = Date.now();
      }, limit - (now - lastUpdated.current));
      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}
