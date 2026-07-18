import { registerAdminUserFromSignup } from "@/src/shared/lib/admin-users-store";
import type {
  DocumentStatus,
  VerificationRequest,
  VerificationRole,
  VerificationStatus,
} from "@/src/shared/lib/mock-verification-requests";
import {
  MOCK_VERIFICATION_REQUESTS,
  ROLE_DOCUMENT_REQUIREMENTS,
} from "@/src/shared/lib/mock-verification-requests";

const STORAGE_KEY = "admin_verification_overrides";
const NEW_REQUESTS_KEY = "admin_verification_new";

type VerificationOverrides = Record<string, VerificationRequest>;

function readOverrides(): VerificationOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as VerificationOverrides;
  } catch {
    return {};
  }
}

function writeOverrides(overrides: VerificationOverrides) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function readNewRequests(): VerificationRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NEW_REQUESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VerificationRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeNewRequests(requests: VerificationRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NEW_REQUESTS_KEY, JSON.stringify(requests));
}

export function getAllVerificationRequests(): VerificationRequest[] {
  const overrides = readOverrides();
  const base = MOCK_VERIFICATION_REQUESTS.map((item) => overrides[item.id] ?? item);
  const created = readNewRequests().map((item) => overrides[item.id] ?? item);
  const seen = new Set<string>();
  return [...created, ...base].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function getVerificationRequest(id: string): VerificationRequest | undefined {
  const overrides = readOverrides();
  const base =
    readNewRequests().find((r) => r.id === id) ??
    MOCK_VERIFICATION_REQUESTS.find((r) => r.id === id);
  if (!base) return undefined;
  return overrides[id] ?? base;
}

export function getVerificationByUserId(userId: string): VerificationRequest | undefined {
  return getAllVerificationRequests().find((r) => r.userId === userId);
}

export function createVerificationFromSignup(input: {
  userId: string;
  name: string;
  email: string;
  role: VerificationRole;
}): VerificationRequest {
  const existing = getVerificationByUserId(input.userId);
  if (existing) return existing;

  const required = ROLE_DOCUMENT_REQUIREMENTS[input.role];
  const now = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const request: VerificationRequest = {
    id: `VR-${Date.now().toString(36).toUpperCase()}`,
    userId: input.userId,
    name: input.name,
    email: input.email,
    role: input.role,
    status: "Pending",
    submittedAt: now,
    documents: required.map((docName, index) => ({
      id: `DOC-${input.userId}-${index}`,
      name: docName,
      type: docName.includes("Tax")
        ? "Tax"
        : docName.includes("Business")
          ? "Business"
          : "Identity",
      uploadedAt: now.split(" ")[0] ?? now,
      status: "Pending" as const,
      fileLabel: `${docName.toLowerCase().replace(/\s+/g, "_")}.pdf`,
    })),
  };

  writeNewRequests([request, ...readNewRequests()]);

  const roleMap: Record<VerificationRole, "User" | "Affiliate" | "Business"> = {
    User: "User",
    Affiliate: "Affiliate",
    Business: "Business",
  };
  registerAdminUserFromSignup({
    userId: input.userId,
    name: input.name,
    email: input.email,
    role: roleMap[input.role],
  });

  return request;
}

export function updateVerificationRequest(
  id: string,
  updater: (current: VerificationRequest) => VerificationRequest
): VerificationRequest | undefined {
  const current = getVerificationRequest(id);
  if (!current) return undefined;
  const next = updater(current);
  const overrides = readOverrides();
  overrides[id] = next;
  writeOverrides(overrides);
  return next;
}

export function updateDocumentStatus(
  requestId: string,
  documentId: string,
  status: DocumentStatus
): VerificationRequest | undefined {
  return updateVerificationRequest(requestId, (current) => ({
    ...current,
    documents: current.documents.map((doc) => (doc.id === documentId ? { ...doc, status } : doc)),
  }));
}

export function updateAccountVerificationStatus(
  requestId: string,
  status: VerificationStatus,
  notes?: string
): VerificationRequest | undefined {
  return updateVerificationRequest(requestId, (current) => ({
    ...current,
    status,
    notes: notes ?? current.notes,
    reviewedAt: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    reviewedBy: "Admin",
  }));
}

export function countPendingVerifications(): number {
  return getAllVerificationRequests().filter(
    (r) => r.status === "Pending" || r.status === "Under Review"
  ).length;
}
