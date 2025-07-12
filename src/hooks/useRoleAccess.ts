"use client";

import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/store/useAuthStore";

export function useRoleAccess() {
  const {
    session,
    userRole,
    isAdmin,
    hasRole,
    requireRole,
    isHydrated,
    promoteToAdmin,
    demoteFromAdmin,
  } = useAuthStore();

  const isAuthenticated = !!session;

  // Permission checking functions
  const canAccess = (requiredRole: UserRole): boolean => {
    if (!isAuthenticated || !isHydrated) return false;
    return hasRole(requiredRole);
  };

  const canAccessAdmin = (): boolean => canAccess("admin");

  const canPromoteUsers = (): boolean => isAdmin;

  const canDemoteUsers = (): boolean => isAdmin;

  // Action functions with permission checks
  const promoteUserToAdmin = async (userId: string) => {
    if (!canPromoteUsers()) {
      throw new Error("Unauthorized: Admin access required");
    }
    return await promoteToAdmin(userId);
  };

  const demoteUserFromAdmin = async (userId: string) => {
    if (!canDemoteUsers()) {
      throw new Error("Unauthorized: Admin access required");
    }
    return await demoteFromAdmin(userId);
  };

  // Route protection
  const redirectIfUnauthorized = (requiredRole: UserRole, redirectPath = "/login") => {
    if (!isAuthenticated) {
      window.location.href = redirectPath;
      return false;
    }
    
    if (!requireRole(requiredRole)) {
      window.location.href = "/unauthorized";
      return false;
    }
    
    return true;
  };

  return {
    // State
    isAuthenticated,
    userRole,
    isAdmin,
    isHydrated,

    // Permission checks
    canAccess,
    canAccessAdmin,
    canPromoteUsers,
    canDemoteUsers,
    hasRole,
    requireRole,

    // Actions
    promoteUserToAdmin,
    demoteUserFromAdmin,

    // Utilities
    redirectIfUnauthorized,
  };
}

// Hook for specific role checks
export function useAdminAccess() {
  const { isAdmin, canAccessAdmin } = useRoleAccess();
  
  return {
    isAdmin,
    canAccessAdmin,
  };
}

export function useUserAccess() {
  const { canAccess } = useRoleAccess();
  
  return {
    canAccessUser: () => canAccess("user"),
  };
}
