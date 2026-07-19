/**
 * Public (unauthenticated) fetch wrapper – isomorphic (works on server and client).
 * @see serverFetch.ts for the authenticated server-only version.
 */

import envConfig from "../config";
import { BackendOfflineError } from "./backend-offline";

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
  timeout?: number;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

/**
 * Public fetch wrapper for accessing public APIs without authentication.
 * Provides consistent error handling and supports query parameters.
 * Network/offline failures throw BackendOfflineError (no noisy stack spam).
 */
export async function PublicServerFetch(input: string, options?: FetchOptions) {
  const base = input.startsWith("http") ? input : `${envConfig.apiBaseURL}${input}`;
  const urlObj = new URL(base);
  const params = options?.params;
  if (params) {
    Object.keys(params).forEach((k) => {
      if (!k || String(k).trim() === "") return;
      const v = params[k];
      if (v !== undefined && v !== null) urlObj.searchParams.set(k, String(v));
    });
  }
  const url = urlObj.toString();

  const headers: Record<string, string> = {};
  if (options?.headers) {
    const h = options.headers as Record<string, string> | Headers;
    if (h instanceof Headers) {
      h.forEach((v, k) => (headers[k] = v));
    } else {
      Object.assign(headers, h as Record<string, string>);
    }
  }

  const timeoutMs = options?.timeout ?? 3000;
  const fetchOptions: FetchOptions = {
    signal: options?.signal || (timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined),
    ...options,
    next: {
      revalidate: 60,
      ...options?.next,
    },
    headers,
  };

  try {
    return await fetch(url, fetchOptions as RequestInit);
  } catch (error) {
    throw new BackendOfflineError(
      `Backend unavailable at ${envConfig.backendURL} (${error instanceof Error ? error.message : "fetch failed"})`
    );
  }
}

export async function PublicServerFetchJson(input: string, options?: FetchOptions) {
  const res = await PublicServerFetch(input, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default PublicServerFetch;
