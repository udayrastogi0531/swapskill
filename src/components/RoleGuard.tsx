"use client";

import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/store/useAuthStore";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  fallback = null, 
  showError = false 
}: RoleGuardProps) {
  const { hasRole, isHydrated, session } = useAuthStore();

  // Don't render anything while loading
  if (!isHydrated) {
    return null;
  }

  // User not authenticated
  if (!session) {
    if (showError) {
      return (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">Please sign in to access this content.</p>
        </div>
      );
    }
    return fallback;
  }

  // User doesn't have required role
  if (!hasRole(requiredRole)) {
    if (showError) {
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            Access denied. Required role: {requiredRole}
          </p>
        </div>
      );
    }
    return fallback;
  }

  return <>{children}</>;
}

// Specific role guard components for convenience
export function AdminGuard({ children, fallback, showError }: Omit<RoleGuardProps, 'requiredRole'>) {
  return (
    <RoleGuard requiredRole="admin" fallback={fallback} showError={showError}>
      {children}
    </RoleGuard>
  );
}

export function UserGuard({ children, fallback, showError }: Omit<RoleGuardProps, 'requiredRole'>) {
  return (
    <RoleGuard requiredRole="user" fallback={fallback} showError={showError}>
      {children}
    </RoleGuard>
  );
}
