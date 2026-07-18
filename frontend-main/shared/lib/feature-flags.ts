/**
 * Feature flag system backed by environment variables.
 *
 * Enable flags by setting the env var:
 *   NEXT_PUBLIC_ENABLE_FEATURE_FLAGS=new_dashboard,beta_chat
 *
 * Usage:
 *   import { isFeatureEnabled } from "@/src/lib/feature-flags";
 *   if (isFeatureEnabled("new_dashboard")) { ... }
 */

/** All known feature flag keys – add new ones here as the app grows. */
export type FeatureFlag =
  | "new_dashboard"
  | "beta_chat"
  | "analytics_v2"
  | "export_csv"
  | "dark_mode_toggle"
  | "maintenance_mode";

/** Parse the env var once at module load. */
function parseFlags(): Set<string> {
  const raw = process.env.NEXT_PUBLIC_ENABLE_FEATURE_FLAGS ?? "";
  return new Set(
    raw
      .split(",")
      .map((f) => f.trim().toLowerCase())
      .filter(Boolean)
  );
}

const enabledFlags = parseFlags();

/**
 * Check whether a feature flag is enabled.
 * @param flag – the feature flag key
 * @returns true if the flag is in the enabled set
 */
export function isFeatureEnabled(flag: FeatureFlag | string): boolean {
  return enabledFlags.has(flag.toLowerCase());
}

/**
 * Return all currently enabled flags (useful for debugging).
 */
export function getEnabledFlags(): string[] {
  return [...enabledFlags];
}
