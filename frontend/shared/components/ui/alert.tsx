"use client";

import * as React from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

export type AlertTone = "info" | "success" | "warning" | "danger";

interface AlertProps {
  tone?: AlertTone;
  /** Optional bold title line above the body. */
  title?: string;
  children?: React.ReactNode;
  /** When set, renders a dismiss button. */
  onDismiss?: () => void;
  className?: string;
}

const TONE_STYLES: Record<
  AlertTone,
  { wrapper: string; icon: React.ComponentType<{ className?: string }> }
> = {
  info: {
    wrapper:
      "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200",
    icon: Info,
  },
  success: {
    wrapper:
      "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200",
    icon: CheckCircle2,
  },
  warning: {
    wrapper:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200",
    icon: AlertTriangle,
  },
  danger: {
    wrapper:
      "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200",
    icon: XCircle,
  },
};

/**
 * Inline alert banner for statuses, warnings, and errors.
 *
 * Usage:
 *   <Alert tone="warning" title="Unsaved changes">
 *     Your draft is stored locally until you submit.
 *   </Alert>
 */
export function Alert({ tone = "info", title, children, onDismiss, className }: AlertProps) {
  const { wrapper, icon: Icon } = TONE_STYLES[tone];
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
        wrapper,
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="flex-1 space-y-0.5">
        {title && <p className="font-semibold leading-tight">{title}</p>}
        {children && <div className="leading-relaxed opacity-90">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
