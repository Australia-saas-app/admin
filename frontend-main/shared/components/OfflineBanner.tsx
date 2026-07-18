"use client";

import { WifiOff, Wifi } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useOnlineStatus } from "@/src/hooks/useOnlineStatus";

/**
 * Fixed connectivity banner. Shows a warning while offline and a brief
 * confirmation once the connection is restored. On reconnect, all React
 * Query caches are invalidated so stale screens refresh automatically.
 */
export function OfflineBanner() {
  const { online, justReconnected } = useOnlineStatus();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (justReconnected) {
      queryClient.invalidateQueries();
    }
  }, [justReconnected, queryClient]);

  if (online && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-[100] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white shadow-lg ${
        online ? "bg-emerald-600" : "bg-amber-600"
      }`}
    >
      {online ? (
        <>
          <Wifi className="h-4 w-4" aria-hidden />
          Back online — refreshing data.
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" aria-hidden />
          You are offline. Changes will be kept locally until the connection returns.
        </>
      )}
    </div>
  );
}
