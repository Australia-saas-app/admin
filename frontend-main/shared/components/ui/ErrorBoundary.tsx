"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { reportError } from "@/src/lib/error-reporter";

interface ErrorBoundaryProps {
  /** Content to render when there is no error. */
  children: ReactNode;
  /**
   * Custom fallback UI to show when an error is caught.
   * Receives the error object and a `reset` callback.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary that gracefully catches rendering errors.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <RiskyComponent />
 *   </ErrorBoundary>
 *
 *   // With custom fallback:
 *   <ErrorBoundary fallback={(err, reset) => <button onClick={reset}>Retry</button>}>
 *     <RiskyComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportError(error, "ErrorBoundary");
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
    }
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive/40 bg-destructive/5 px-6 py-10 text-center"
        >
          <div className="text-destructive text-4xl" aria-hidden="true">
            ⚠️
          </div>
          <h2 className="text-base font-semibold text-foreground">Something went wrong</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            {this.state.error.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={this.reset}
            className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
