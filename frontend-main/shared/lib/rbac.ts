/**
 * Role-Based Access Control (RBAC) definitions.
 *
 * Usage:
 *   import { can, ROLES } from "@/src/lib/rbac";
 *   if (can(user.role, "export:data")) { ... }
 */

// ─── Role Definitions ──────────────────────────────────────────────────────────

export const ROLES = {
  USER: "USER",
  BUYER: "BUYER",
  SELLER: "SELLER",
  BUSINESS: "BUSINESS",
  AFFILIATE: "AFFILIATE",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES] | string;

// ─── Permission Definitions ────────────────────────────────────────────────────

/**
 * All application permissions.
 * Format: "resource:action"
 */
export type Permission =
  // Profile
  | "profile:view"
  | "profile:edit"
  | "profile:delete"
  // Projects
  | "project:view"
  | "project:create"
  | "project:edit"
  | "project:delete"
  // Payments
  | "payment:view"
  | "payment:create"
  // Data
  | "data:export"
  // Records (admin CRUD, action-level)
  | "record:create"
  | "record:update"
  | "record:delete"
  // Admin
  | "admin:dashboard"
  | "admin:reports"
  | "admin:users"
  | "admin:admins"
  | "admin:content"
  | "admin:marketplace"
  | "admin:network"
  | "admin:finance"
  | "admin:settings"
  // Affiliate
  | "affiliate:dashboard"
  | "affiliate:social-post"
  // Business
  | "business:dashboard"
  | "business:post-project";

// ─── Role → Permission Map ─────────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.USER]: ["profile:view", "profile:edit", "profile:delete", "project:view", "payment:view"],
  [ROLES.BUYER]: [
    "profile:view",
    "profile:edit",
    "profile:delete",
    "project:view",
    "project:create",
    "payment:view",
    "payment:create",
    "data:export",
  ],
  [ROLES.SELLER]: [
    "profile:view",
    "profile:edit",
    "profile:delete",
    "project:view",
    "project:create",
    "project:edit",
    "project:delete",
    "payment:view",
    "payment:create",
    "data:export",
    "business:dashboard",
    "business:post-project",
  ],
  [ROLES.BUSINESS]: [
    "profile:view",
    "profile:edit",
    "profile:delete",
    "project:view",
    "project:create",
    "project:edit",
    "project:delete",
    "payment:view",
    "payment:create",
    "data:export",
    "business:dashboard",
    "business:post-project",
  ],
  [ROLES.AFFILIATE]: [
    "profile:view",
    "profile:edit",
    "profile:delete",
    "project:view",
    "payment:view",
    "affiliate:dashboard",
    "affiliate:social-post",
    "data:export",
  ],
  [ROLES.ADMIN]: [
    "profile:view",
    "profile:edit",
    "project:view",
    "project:create",
    "project:edit",
    "project:delete",
    "payment:view",
    "data:export",
    "record:create",
    "record:update",
    "admin:dashboard",
    "admin:reports",
    "admin:users",
    "admin:content",
    "admin:marketplace",
    "admin:network",
    "admin:finance",
    "business:dashboard",
  ],
  [ROLES.SUPER_ADMIN]: [
    // Super admin has ALL permissions
    "profile:view",
    "profile:edit",
    "profile:delete",
    "project:view",
    "project:create",
    "project:edit",
    "project:delete",
    "payment:view",
    "payment:create",
    "data:export",
    "record:create",
    "record:update",
    "record:delete",
    "admin:dashboard",
    "admin:reports",
    "admin:users",
    "admin:admins",
    "admin:content",
    "admin:marketplace",
    "admin:network",
    "admin:finance",
    "admin:settings",
    "affiliate:dashboard",
    "affiliate:social-post",
    "business:dashboard",
    "business:post-project",
  ],
};

// ─── Permission Checker ────────────────────────────────────────────────────────

/**
 * Check whether a role has a specific permission.
 * Returns false for unknown roles.
 *
 * @example can("SELLER", "business:dashboard") // true
 */
export function can(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role.toUpperCase()] ?? [];
  return permissions.includes(permission);
}

/**
 * Check whether a role has ALL of the specified permissions.
 */
export function canAll(role: Role | null | undefined, permissions: Permission[]): boolean {
  return permissions.every((p) => can(role, p));
}

/**
 * Check whether a role has ANY of the specified permissions.
 */
export function canAny(role: Role | null | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p));
}

/**
 * Get all permissions for a role.
 */
export function getPermissions(role: Role | null | undefined): Permission[] {
  if (!role) return [];
  return ROLE_PERMISSIONS[role.toUpperCase()] ?? [];
}

/**
 * Check if a role is an admin-level role.
 */
export function isAdminRole(role: Role | null | undefined): boolean {
  return role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
}
