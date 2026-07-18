"use client";

import { useEffect } from "react";
import { recordRecentlyViewed } from "@/src/lib/recently-viewed";

interface TrackViewProps {
  id: string;
  type: string;
  title: string;
  href: string;
  image?: string;
}

/** Records the page in the recently-viewed history on mount. Renders nothing. */
export function TrackView({ id, type, title, href, image }: TrackViewProps) {
  useEffect(() => {
    recordRecentlyViewed({ id, type, title, href, image });
  }, [id, type, title, href, image]);

  return null;
}
