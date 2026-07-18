"use client";

import type { FieldErrors } from "react-hook-form";
import { AlertTriangle } from "lucide-react";

interface ValidationSummaryProps {
  errors: FieldErrors;
  /** Optional heading; defaults to a generic message. */
  title?: string;
  /** Map field names to human-readable labels for the list. */
  labels?: Record<string, string>;
  className?: string;
}

function collectMessages(
  errors: FieldErrors,
  labels: Record<string, string>,
  prefix = ""
): { field: string; message: string }[] {
  const messages: { field: string; message: string }[] = [];
  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value.message === "string" && value.message) {
      messages.push({ field: labels[path] ?? labels[key] ?? key, message: value.message });
    } else if (typeof value === "object") {
      messages.push(...collectMessages(value as FieldErrors, labels, path));
    }
  }
  return messages;
}

/**
 * Top-of-form validation summary. Renders an accessible list of every field
 * error so users see all problems at once instead of hunting field by field.
 *
 * Usage:
 *   <ValidationSummary errors={form.formState.errors} labels={{ fullName: "Full name" }} />
 */
export function ValidationSummary({
  errors,
  title = "Please fix the following before continuing:",
  labels = {},
  className,
}: ValidationSummaryProps) {
  const messages = collectMessages(errors, labels);
  if (messages.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 ${className ?? ""}`}
    >
      <p className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-9">
        {messages.map(({ field, message }) => (
          <li key={`${field}-${message}`}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default ValidationSummary;
