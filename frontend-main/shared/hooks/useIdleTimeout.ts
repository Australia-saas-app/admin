"use client";

import { useEffect, useRef } from "react";

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
];

export interface UseIdleTimeoutOptions {
  /** Idle duration in milliseconds before `onIdle` fires. */
  timeoutMs: number;
  /** Called once when the user has been idle for `timeoutMs`. */
  onIdle: () => void;
  /** When false, the timer is disabled (e.g. logged-out). Default true. */
  enabled?: boolean;
}

/**
 * Fires `onIdle` after `timeoutMs` of no mouse/keyboard/touch/scroll activity.
 * Activity resets the timer. Useful for activity-based session logout.
 */
export function useIdleTimeout({ timeoutMs, onIdle, enabled = true }: UseIdleTimeoutOptions): void {
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  useEffect(() => {
    if (!enabled || timeoutMs <= 0 || typeof window === "undefined") return;

    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    reset();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, reset, { passive: true });
    }

    return () => {
      clearTimeout(timer);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, reset);
      }
    };
  }, [timeoutMs, enabled]);
}
