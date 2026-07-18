"use client";

import Link from "next/link";
import { useEffect } from "react";
import { reportError } from "@/src/lib/error-reporter";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, "web:root-error-boundary");
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Error 500</p>
        <h1 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
