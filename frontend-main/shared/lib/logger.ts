/**
 * Lightweight structured logger.
 *
 * - In production: only `warn` and `error` are emitted.
 * - In development: all levels are emitted with a timestamp prefix.
 *
 * Usage:
 *   import logger from "@/src/lib/logger";
 *   logger.info("User logged in", { userId: "abc" });
 *   logger.error("Token refresh failed", error);
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const isDev = process.env.NODE_ENV !== "production";

function formatMessage(level: LogLevel, message: string, context?: string): string {
  const time = new Date().toISOString();
  const tag = context ? `[${context}]` : "";
  return `[${time}] [${level.toUpperCase()}]${tag} ${message}`;
}

function log(level: LogLevel, message: string, data?: unknown, context?: string): void {
  // Suppress debug/info in production
  if (!isDev && (level === "debug" || level === "info")) return;

  const formatted = formatMessage(level, message, context);

  switch (level) {
    case "debug":
      console.debug(formatted, data ?? "");
      break;
    case "info":
      console.info(formatted, data ?? "");
      break;
    case "warn":
      console.warn(formatted, data ?? "");
      break;
    case "error":
      console.error(formatted, data ?? "");
      break;
  }
}

const logger = {
  debug: (message: string, data?: unknown, context?: string) =>
    log("debug", message, data, context),
  info: (message: string, data?: unknown, context?: string) =>
    log("info", message, data, context),
  warn: (message: string, data?: unknown, context?: string) =>
    log("warn", message, data, context),
  error: (message: string, data?: unknown, context?: string) =>
    log("error", message, data, context),

  /**
   * Create a child logger with a fixed context tag.
   * @example const log = logger.child("AuthService");
   */
  child: (context: string) => ({
    debug: (message: string, data?: unknown) => log("debug", message, data, context),
    info: (message: string, data?: unknown) => log("info", message, data, context),
    warn: (message: string, data?: unknown) => log("warn", message, data, context),
    error: (message: string, data?: unknown) => log("error", message, data, context),
  }),
};

export default logger;
