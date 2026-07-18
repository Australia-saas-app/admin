/**
 * Central error reporting.
 *
 * Every uncaught error funnels through `reportError`:
 *  - always logged via the structured logger
 *  - kept in a rolling sessionStorage buffer (inspectable in production)
 *  - forwarded to Sentry when NEXT_PUBLIC_SENTRY_DSN is set (uses the plain
 *    HTTP store endpoint – no SDK dependency required)
 *
 * `installGlobalErrorReporting()` attaches window `error` /
 * `unhandledrejection` listeners exactly once; the Providers component calls
 * it on mount so both apps get coverage for free.
 */

import logger from "./logger";

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: string;
  url?: string;
  timestamp: string;
}

const STORAGE_KEY = "sysdb.error-reports";
const MAX_REPORTS = 50;

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

function persistReport(report: ErrorReport): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const reports = raw ? (JSON.parse(raw) as ErrorReport[]) : [];
    reports.push(report);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(-MAX_REPORTS)));
  } catch {
    // Storage unavailable – reporting degrades to console only.
  }
}

/** Parse a Sentry DSN into its HTTP store endpoint. Returns null when unset/invalid. */
function sentryStoreEndpoint(): { url: string } | null {
  if (!SENTRY_DSN) return null;
  try {
    const dsn = new URL(SENTRY_DSN);
    const projectId = dsn.pathname.replace(/\//g, "");
    if (!dsn.username || !projectId) return null;
    return {
      url: `${dsn.protocol}//${dsn.host}/api/${projectId}/store/?sentry_key=${dsn.username}`,
    };
  } catch {
    return null;
  }
}

function forwardToSentry(report: ErrorReport): void {
  const endpoint = sentryStoreEndpoint();
  if (!endpoint || typeof fetch === "undefined") return;

  const event = {
    message: report.message,
    level: "error",
    platform: "javascript",
    timestamp: report.timestamp,
    request: report.url ? { url: report.url } : undefined,
    tags: report.context ? { context: report.context } : undefined,
    exception: report.stack
      ? { values: [{ type: "Error", value: report.message, raw_stacktrace: report.stack }] }
      : undefined,
  };

  // Fire and forget – error reporting must never break the app.
  fetch(endpoint.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => undefined);
}

/**
 * Report an error to all configured sinks.
 * Safe to call from anywhere (client or server, inside catch blocks, etc.).
 */
export function reportError(error: unknown, context?: string): void {
  const err = error instanceof Error ? error : new Error(String(error));
  const report: ErrorReport = {
    message: err.message,
    stack: err.stack,
    context,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    timestamp: new Date().toISOString(),
  };

  logger.error(report.message, { stack: report.stack }, context ?? "ErrorReporter");
  persistReport(report);
  forwardToSentry(report);
}

/** Return the errors captured in this browser session (most recent last). */
export function getErrorReports(): ErrorReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ErrorReport[]) : [];
  } catch {
    return [];
  }
}

let installed = false;

/**
 * Attach global listeners for uncaught errors and unhandled promise
 * rejections. Idempotent – calling twice is a no-op.
 */
export function installGlobalErrorReporting(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (event) => {
    reportError(event.error ?? event.message, "window.onerror");
  });

  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason, "unhandledrejection");
  });
}

const errorReporter = { reportError, getErrorReports, installGlobalErrorReporting };
export default errorReporter;
