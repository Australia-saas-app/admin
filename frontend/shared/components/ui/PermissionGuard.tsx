"use client";

import * as React from "react";
import { usePermission } from "@/src/hooks/permission.hook";
import { Permission } from "@/src/lib/rbac";
import { EmptyState } from "./EmptyState";
import { ShieldOff } from "lucide-react";

interface PermissionGuardProps {
  /** Single permission required */
  permission?: Permission;
  /** All of these permissions required */
  all?: Permission[];
  /** At least one of these permissions required */
  any?: Permission[];
  /** Content to render when permission is granted */
  children: React.ReactNode;
  /**
   * Custom fallback when access is denied.
   * Defaults to an access-denied empty state.
   */
  fallback?: React.ReactNode;
  /**
   * If true, renders nothing (null) instead of the fallback when access is denied.
   * Useful for hiding menu items.
   */
  silent?: boolean;
}

/**
 * Component-level permission guard.
 * Renders children only when the current user has the required permission(s).
 *
 * Usage:
 *   <PermissionGuard permission="data:export">
 *     <ExportButton />
 *   </PermissionGuard>
 *
 *   <PermissionGuard any={["admin:dashboard", "business:dashboard"]} silent>
 *     <AdminMenu />
 *   </PermissionGuard>
 */
export function PermissionGuard({
  permission,
  all,
  any,
  children,
  fallback,
  silent = false,
}: PermissionGuardProps) {
  const { can, canAll, canAny } = usePermission();

  let granted = true;

  if (permission) granted = can(permission);
  if (all) granted = granted && canAll(all);
  if (any) granted = granted && canAny(any);

  if (!granted) {
    if (silent) return null;
    if (fallback) return <>{fallback}</>;
    return (
      <EmptyState
        icon={<ShieldOff className="w-8 h-8" />}
        title="Access Denied"
        description="You don't have permission to view this content."
        className="my-6"
      />
    );
  }

  return <>{children}</>;
}

export default PermissionGuard;
