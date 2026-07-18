/**
 * Centralized environment variable validation.
 * Warns in development when required variables are missing.
 * Call validateEnv() once at startup (e.g. in config/index.ts).
 */

interface EnvVar {
  key: string;
  required: boolean;
  description: string;
}

const ENV_VARS: EnvVar[] = [
  {
    key: "NEXT_PUBLIC_BACKEND_URL",
    required: false,
    description: "Backend API base URL. Falls back to http://35.162.205.9:3006 in development.",
  },
  {
    key: "NEXT_PUBLIC_APP_NAME",
    required: false,
    description: "Application display name shown in metadata.",
  },
  {
    key: "NEXT_PUBLIC_APP_ENV",
    required: false,
    description: "Runtime environment (development | staging | production).",
  },
  {
    key: "NEXT_PUBLIC_ENABLE_FEATURE_FLAGS",
    required: false,
    description: "Comma-separated list of enabled feature flag keys.",
  },
];

/**
 * Validate environment variables at startup.
 * Only logs warnings – never throws – so it never breaks the app.
 */
export function validateEnv(): void {
  if (typeof window !== "undefined") return; // client-side: skip
  if (process.env.NODE_ENV === "production") return; // only warn in dev

  for (const { key, required, description } of ENV_VARS) {
    const value = process.env[key];
    if (required && !value) {
      console.warn(
        `[env] ⚠️  Required env var "${key}" is missing.\n  Description: ${description}`
      );
    } else if (!value) {
      // Optional vars: only log at debug level (suppressed in most setups)
      // console.debug(`[env] ℹ️  Optional env var "${key}" not set. ${description}`);
    }
  }
}

export default validateEnv;
