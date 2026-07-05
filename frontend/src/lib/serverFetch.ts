"use server";
import { cookies } from "next/headers";

type FetchOptions = RequestInit & { next?: Record<string, unknown>; params?: Record<string, string> };

/**
 * Server-side fetch wrapper that forwards server cookies (accessToken) as
 * Authorization: Bearer <token> and provides consistent error handling.
 * Use this from server code (eg. in app routes or server actions).
 */
export async function serverFetch( baseUrl: string,input: string, options?: FetchOptions) {
  const base = input.startsWith("http") ? input : `${baseUrl}${input}`;
  // Allow callers to pass `params` (query parameters) via options.params
  const urlObj = new URL(base);
  const params = options?.params;
  if (params) {
    Object.keys(params).forEach((k) => {
      // skip empty keys which would produce malformed query strings like "=value"
      if (!k || String(k).trim() === "") return;
      const v = params[k];
      if (v !== undefined && v !== null) urlObj.searchParams.set(k, String(v));
    });
  }
  const url = urlObj.toString();

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {};
  if (options?.headers) {
    // copy existing headers into plain object
    const h = options.headers as Record<string, string> | Headers;
    if (h instanceof Headers) {
      h.forEach((v, k) => (headers[k] = v));
    } else {
      Object.assign(headers, h as Record<string, string>);
    }
  }

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: FetchOptions = {
    ...options,
    headers,
  };

  const res = await fetch(url, fetchOptions as RequestInit);
  return res;
}

export async function serverFetchJson(baseUrl: string, input: string, options?: FetchOptions) {
  const res = await serverFetch(baseUrl,input, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default serverFetch;
