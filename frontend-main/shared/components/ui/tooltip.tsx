"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  /** Tooltip text content. */
  content: React.ReactNode;
  /** The trigger element. Gets aria-describedby wired automatically. */
  children: React.ReactElement<Record<string, unknown>>;
  side?: TooltipSide;
  /** Extra classes for the tooltip bubble. */
  className?: string;
}

const SIDE_CLASSES: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

let tooltipCounter = 0;

/**
 * Lightweight CSS-driven tooltip. Shows on hover and keyboard focus, hides on
 * Escape, and exposes the content to screen readers via aria-describedby.
 *
 * Usage:
 *   <Tooltip content="Export the current view as CSV">
 *     <button aria-label="Export">…</button>
 *   </Tooltip>
 */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const idRef = React.useRef<string | undefined>(undefined);
  if (!idRef.current) idRef.current = `tooltip-${++tooltipCounter}`;

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") hide();
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      {React.cloneElement(children, { "aria-describedby": idRef.current })}
      <span
        role="tooltip"
        id={idRef.current}
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-[16rem] rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-md transition-opacity duration-150",
          SIDE_CLASSES[side],
          visible ? "opacity-100" : "opacity-0",
          className
        )}
        aria-hidden={!visible}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
