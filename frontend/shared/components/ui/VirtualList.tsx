"use client";

import React, { useRef, useState, useEffect, UIEvent } from "react";

interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of the list container in pixels */
  height: number;
  /** Fixed height of each individual item in pixels */
  itemHeight: number;
  /** Render callback for each visible item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Optional container className */
  className?: string;
}

/**
 * Reusable list virtualization component to handle large datasets.
 * Only renders items that are currently visible within the scrolling viewport.
 * Prevents DOM bloat and maintains 60 FPS scrolling on tables or lists with thousands of items.
 *
 * Usage:
 *   <VirtualList
 *     items={myTenThousandItems}
 *     height={400}
 *     itemHeight={50}
 *     renderItem={(item, index) => <Row key={item.id} data={item} />}
 *   />
 */
export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = "",
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2); // Buffer of 2 items
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / itemHeight) + 2
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-y-auto relative ${className}`}
      style={{ height: `${height}px` }}
    >
      <div style={{ height: `${totalHeight}px`, width: "100%", position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
          }}
        >
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;
