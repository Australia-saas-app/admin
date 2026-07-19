"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface EmptyStateProps {
  /** Icon to display (React node, e.g. a Lucide icon). */
  icon?: React.ReactNode;
  /** Primary heading. */
  title: string;
  /** Supporting description. */
  description?: string;
  /** Optional call-to-action button or link. */
  action?: React.ReactNode;
  /** Additional className for the wrapper. */
  className?: string;
}

/**
 * Reusable empty state component.
 *
 * Usage:
 *   <EmptyState
 *     icon={<Inbox className="w-12 h-12 text-muted-foreground" />}
 *     title="No projects yet"
 *     description="Create your first project to get started."
 *     action={<Button>Create project</Button>}
 *   />
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="flex items-center justify-center rounded-full bg-muted p-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
