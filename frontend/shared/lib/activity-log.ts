/**
 * Client-side activity log / audit trail helper.
 *
 * Records user and admin actions in memory, persists them to localStorage so
 * the audit trail survives reloads, and exposes a `getLog()` method.
 * Designed to be easily wired to an analytics provider (Segment, Posthog, etc.)
 * by replacing the `emit` function — and to the backend audit endpoint once
 * it is available.
 *
 * Usage:
 *   import activityLog from "@/src/lib/activity-log";
 *   activityLog.record("USER_LOGIN", { role: "BUYER" });
 *   activityLog.record("ADMIN_DELETE", { resource: "Notices", id: "N-104" });
 */

export interface ActivityEvent {
  action: string;
  payload?: Record<string, unknown>;
  timestamp: string;
}

/** Maximum number of events retained in the buffer / localStorage. */
const MAX_BUFFER = 300;

const STORAGE_KEY = "sysdb.activity-log";

function loadPersisted(): ActivityEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ActivityEvent[]) : [];
    return Array.isArray(parsed) ? parsed.slice(-MAX_BUFFER) : [];
  } catch {
    return [];
  }
}

function persist(events: ActivityEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_BUFFER)));
  } catch {
    // Storage full or unavailable – audit trail degrades to in-memory only.
  }
}

const buffer: ActivityEvent[] = loadPersisted();

/**
 * Override this function to forward events to an external analytics provider.
 * By default it is a no-op in production and logs to console in development.
 */
let emit: (event: ActivityEvent) => void = (event) => {
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[activity] ${event.action}`, event.payload ?? "");
  }
};

const activityLog = {
  /**
   * Record a user action.
   * @param action  – machine-readable action name, e.g. "USER_LOGIN"
   * @param payload – optional metadata
   */
  record(action: string, payload?: Record<string, unknown>): void {
    if (typeof window === "undefined") return; // server-side: skip

    const event: ActivityEvent = {
      action,
      payload,
      timestamp: new Date().toISOString(),
    };

    // Maintain rolling buffer
    if (buffer.length >= MAX_BUFFER) buffer.shift();
    buffer.push(event);
    persist(buffer);

    emit(event);
  },

  /**
   * Replace the default emitter with a custom analytics provider.
   * @example activityLog.setEmitter((e) => analytics.track(e.action, e.payload));
   */
  setEmitter(fn: (event: ActivityEvent) => void): void {
    emit = fn;
  },

  /** Return a copy of the current in-memory event buffer. */
  getLog(): ActivityEvent[] {
    return [...buffer];
  },

  /** Clear the buffer and the persisted audit trail. */
  clear(): void {
    buffer.length = 0;
    persist(buffer);
  },
};

export default activityLog;
