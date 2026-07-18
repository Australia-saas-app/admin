"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "@/src/lib/axiosInstance";
import { IDecodedToken } from "@/src/types/auth.types";
import {
  parseApiError,
  getLoginErrorMessage,
  AUTH_MESSAGES,
  isNetworkOrTimeoutError,
} from "@/src/lib/api-error";
import logger from "@/src/lib/logger";
import {
  DEMO_ACCOUNTS,
  findDemoAccount,
  type DemoAccountType,
} from "@/src/constants/demo-accounts";
import {
  findRegisteredUser,
  registerUserFromDraft,
  updateRegisteredPassword,
  verifyRegisteredPassword,
} from "@/src/server/RegisteredUsersStore";
import { normalizeContact } from "@/src/lib/normalize-contact";

const log = logger.child("AuthService");

const AUTH_REQUEST_TIMEOUT = 10000;

/**
 * Secure cookies require HTTPS. On a GCP VM served over http://IP:port,
 * Secure cookies are dropped by the browser and login appears to fail.
 * Prefer COOKIE_SECURE=true|false; otherwise infer from NEXT_PUBLIC_SITE_URL.
 */
function shouldUseSecureCookies(): boolean {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  if (process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")) return true;
  if (process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http://")) return false;
  return process.env.NODE_ENV === "production";
}

/** Shared cookie options – Lax for same-site forms; Secure only when HTTPS. */
function getCookieOptions() {
  return {
    httpOnly: true,
    secure: shouldUseSecureCookies(),
    sameSite: "lax" as const,
    maxAge: 604800, // 7 days
    path: "/",
  };
}

/** Refresh tokens live longer than access tokens (30 days). */
function getRefreshCookieOptions() {
  return { ...getCookieOptions(), maxAge: 2592000 };
}

/**
 * Persist auth tokens from a backend response payload. Handles both
 * `token`/`accessToken` naming and stores `refreshToken` when present so the
 * axios 401-retry refresh flow can actually succeed.
 */
async function persistSessionTokens(payload: unknown) {
  const data = payload as
    { token?: string; accessToken?: string; refreshToken?: string } | undefined;
  const accessToken = data?.token || data?.accessToken;
  if (!accessToken) return;

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, getCookieOptions());
  if (data?.refreshToken) {
    cookieStore.set("refreshToken", data.refreshToken, getRefreshCookieOptions());
  }
}

/**
 * Server-side request validation (never trust the client payload).
 * Schemas are intentionally permissive about extra fields – each role's
 * registration form sends different attributes – but core credentials
 * are always validated here before leaving the server action.
 */
const serverLoginSchema = z.object({
  identifier: z.string().trim().min(1).max(256),
  password: z.string().min(1).max(256),
});

const serverRegisterSchema = z
  .object({
    email: z.string().trim().email().max(256).optional(),
    contact: z.string().trim().min(3).max(256).optional(),
    password: z.string().min(8).max(256),
  })
  .loose()
  .refine((value) => Boolean(value.email || value.contact), {
    message: "An email address or contact is required",
  });

function encodeBase64Url(value: string): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createDemoToken(payload: IDecodedToken): string {
  const header = encodeBase64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = encodeBase64Url(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 604800,
    })
  );
  return `${header}.${body}.demo-signature`;
}

async function setDemoSession(accountType: DemoAccountType) {
  const account = DEMO_ACCOUNTS[accountType];
  const token = createDemoToken({
    id: `demo-${accountType}`,
    email: account.email,
    role: account.role,
    name: account.label,
    status: "ACTIVE",
  });

  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, getCookieOptions());

  return {
    success: true,
    message: "Demo login successful",
    data: {
      token,
      user: {
        id: `demo-${accountType}`,
        email: account.email,
        role: account.role,
      },
    },
  };
}

async function setRegisteredUserSession(user: {
  id: string;
  contact: string;
  role: string;
  fullName?: string;
}) {
  const token = createDemoToken({
    id: user.id,
    email: user.contact,
    role: user.role,
    name: user.fullName ?? user.contact,
    status: "ACTIVE",
  });

  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, getCookieOptions());

  return {
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user.id,
        email: user.contact,
        role: user.role,
      },
    },
  };
}

export const demoLogin = async (accountType: DemoAccountType) => {
  return setDemoSession(accountType);
};

export const registerUser = async (userData: FieldValues) => {
  const validation = serverRegisterSchema.safeParse(userData);
  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new Error(
      issue ? `${issue.path.join(".") || "form"}: ${issue.message}` : "Invalid registration data"
    );
  }

  try {
    const payload: Record<string, unknown> = { ...userData };
    if (!payload["businessCategoryId"] && payload["businessCategoryMain"]) {
      payload["businessCategoryId"] = payload["businessCategoryMain"];
    }
    if (!payload["subBusinessCategoryId"] && payload["businessCategorySub"]) {
      payload["subBusinessCategoryId"] = payload["businessCategorySub"];
    }
    if (
      typeof payload["subBusinessCategoryId"] === "string" &&
      !(payload["subBusinessCategoryId"] as string).trim()
    ) {
      delete payload["subBusinessCategoryId"];
    }
    if ("confirmPassword" in payload) delete payload["confirmPassword"];

    const { data } = await axiosInstance.post("/auth/register", payload);

    if (data?.success) {
      await persistSessionTokens(data?.data);
    }
    return data;
  } catch (error: unknown) {
    log.warn("API registration unavailable, using demo store", error);
    const registered = await registerUserFromDraft(payloadAsDraft(userData));
    return {
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: registered.id,
          email: registered.contact,
          role: registered.role,
        },
      },
    };
  }
};

function payloadAsDraft(userData: FieldValues): Record<string, unknown> {
  return { ...userData };
}

export const completeDemoRegistration = async (draft: Record<string, unknown>) => {
  const registered = await registerUserFromDraft(draft);
  log.info("Demo registration completed", { contact: registered.contact, role: registered.role });
  const session = await setRegisteredUserSession(registered);
  return {
    success: true,
    message: "Account created successfully",
    data: {
      ...session.data,
      user: {
        id: registered.id,
        email: registered.contact,
        role: registered.role,
      },
    },
  };
};

export const changeRegisteredPassword = async (input: {
  email: string;
  currentPassword: string;
  newPassword: string;
}) => {
  if (input.newPassword !== input.newPassword.trim()) {
    throw new Error("Password cannot contain leading or trailing spaces");
  }
  if (input.newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }
  await updateRegisteredPassword(input.email, input.currentPassword, input.newPassword);
  return { success: true, message: "Password updated successfully" };
};

export const verifyAccountPassword = async (email: string, password: string) => {
  const valid = await verifyRegisteredPassword(email, password);
  if (!valid) {
    throw new Error("Password is incorrect");
  }
  return { success: true };
};

export const loginUser = async (userData: FieldValues) => {
  const identifier = String(userData.email ?? userData.contact ?? "");
  const password = String(userData.password ?? "");

  const validation = serverLoginSchema.safeParse({ identifier, password });
  if (!validation.success) {
    throw new Error(AUTH_MESSAGES.invalidCredentials);
  }

  const demoAccount = findDemoAccount(identifier, password);
  if (demoAccount) {
    log.info("Demo login", { type: demoAccount.type });
    return setDemoSession(demoAccount.type);
  }

  const registered = await findRegisteredUser(identifier, password);
  if (registered) {
    log.info("Registered user login", { contact: registered.contact });
    return setRegisteredUserSession(registered);
  }

  try {
    const loginPayload = {
      ...userData,
      email: normalizeContact(identifier).includes("@") ? normalizeContact(identifier) : identifier,
    };
    const { data } = await axiosInstance.post("/auth/login", loginPayload, {
      timeout: AUTH_REQUEST_TIMEOUT,
    });

    if (data?.success) {
      await persistSessionTokens(data?.data);
      return data;
    }

    throw new Error(
      typeof data?.message === "string" && data.message.trim()
        ? data.message
        : AUTH_MESSAGES.invalidCredentials
    );
  } catch (error: unknown) {
    const message = getLoginErrorMessage(error);
    log.warn("Login failed", { reason: message });
    throw new Error(message);
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  try {
    await axiosInstance.post("/auth/logout");
  } catch {
    // ignore logout API errors
  }
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("user");
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let payload = parts[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4 !== 0) payload += "=";
    const json = Buffer.from(payload, "base64").toString("utf8");
    const parsed = JSON.parse(json) as IDecodedToken;
    // Note: do NOT log token payload – it may contain PII
    return parsed;
  } catch {
    try {
      cookieStore.delete("accessToken");
    } catch {}
    return null;
  }
};

export const getNewAccessToken = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const res = await axiosInstance({
      url: "/auth/refresh-token",
      method: "POST",
      withCredentials: true,
      headers: {
        cookie: `refreshToken=${refreshToken}`,
      },
    });
    // Support refresh-token rotation: persist the new pair when returned.
    if (res.data?.data?.refreshToken) {
      cookieStore.set("refreshToken", res.data.data.refreshToken, getRefreshCookieOptions());
    }
    return res.data;
  } catch (error: unknown) {
    log.warn("Token refresh failed", error);
    throw new Error("Failed to get new access token");
  }
};

export const requestPasswordReset = async (payload: { email: string }) => {
  try {
    const { data } = await axiosInstance.post("/auth/forgot-password", payload, {
      timeout: AUTH_REQUEST_TIMEOUT,
    });
    return data;
  } catch (error: unknown) {
    if (isNetworkOrTimeoutError(error)) {
      return {
        success: true,
        message: "If an account exists, a reset code has been sent.",
      };
    }
    throw new Error(parseApiError(error, AUTH_MESSAGES.resetFailed));
  }
};

export const confirmPasswordReset = async (password: string, token: string) => {
  try {
    const { data } = await axiosInstance.post(
      "/auth/reset-password",
      { password },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: AUTH_REQUEST_TIMEOUT,
      }
    );
    return data;
  } catch (error: unknown) {
    if (isNetworkOrTimeoutError(error)) {
      throw new Error(AUTH_MESSAGES.passwordResetFailed);
    }
    throw new Error(parseApiError(error, AUTH_MESSAGES.passwordResetFailed));
  }
};
