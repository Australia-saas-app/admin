"use client";

import React from "react";
import { useAppSelector } from "@/src/core/store/hooks";
import { hasPermission, hasAnyPermission, hasAllPermissions, Permission, UserRole } from "./rbac";

interface ProtectProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  permissions?: Permission[];
  requireAll?: boolean;
  roles?: UserRole[];
}

export function Protect({ children, fallback = null, permissions, requireAll = false, roles }: ProtectProps) {
  const user = useAppSelector((state) => state.auth.user);
  
  if (!user) return fallback;

  // Assuming user has a single primary role in the Admin system
  const userRole = (user.role as UserRole) || "customer";

  // Check roles first if provided
  if (roles && roles.length > 0) {
    if (!roles.includes(userRole)) {
      return fallback;
    }
  }

  // Check permissions if provided
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(userRole, permissions) 
      : hasAnyPermission(userRole, permissions);
      
    if (!hasAccess) {
      return fallback;
    }
  }

  return <>{children}</>;
}
