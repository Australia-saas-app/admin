"use client";

import { useEffect, useState } from "react";

export interface OnlineStatus {
  /** Whether the browser currently reports a network connection. */
  online: boolean;
  /** True right after the connection is restored (until acknowledged). */
  justReconnected: boolean;
}

/**
 * Tracks the browser's connectivity via `navigator.onLine` and the
 * `online`/`offline` window events. `justReconnected` stays true for a few
 * seconds after connectivity returns so UIs can show a "back online" state.
 */
export function useOnlineStatus(reconnectNoticeMs = 4000): OnlineStatus {
  const [online, setOnline] = useState(true);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);

    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleOnline = () => {
      setOnline(true);
      setJustReconnected(true);
      clearTimeout(timer);
      timer = setTimeout(() => setJustReconnected(false), reconnectNoticeMs);
    };
    const handleOffline = () => {
      setOnline(false);
      setJustReconnected(false);
      clearTimeout(timer);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(timer);
    };
  }, [reconnectNoticeMs]);

  return { online, justReconnected };
}
