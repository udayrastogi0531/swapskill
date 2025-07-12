"use client";

import React from "react";
import { AdminGuard, UserGuard, RoleGuard } from "@/components/RoleGuard";
import { useRoleAccess, useAdminAccess } from "@/hooks/useRoleAccess";
import { useAuthStore } from "@/store/useAuthStore";

export function RoleBasedExample() {
  const { session, userRole, isAdmin } = useAuthStore();
  const { isAuthenticated, canAccessAdmin } = useRoleAccess();
  const { isAdmin: adminCheck } = useAdminAccess();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Authentication Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please sign in to see the role-based authentication examples.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-card rounded-lg shadow-lg border border-border p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Role-Based Authentication Demo
        </h1>
        
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Current User Information
          </h2>
          <div className="space-y-2 text-blue-800 dark:text-blue-300">
            <p><strong>Email:</strong> {session?.email}</p>
            <p><strong>Role:</strong> {userRole}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}</p>
            <p><strong>Can Access Admin:</strong> {canAccessAdmin() ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Admin-only content */}
      <div className="bg-card rounded-lg shadow-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Admin-Only Section
        </h2>
        
        <AdminGuard 
          fallback={
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-muted-foreground">
                This content is only visible to administrators.
                You need admin role to view this section.
              </p>
            </div>
          }
        >
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
              🔒 Admin Dashboard
            </h3>
            <p className="text-green-800 dark:text-green-300 mb-4">
              Congratulations! You have admin access. Here you can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-400">
              <li>Manage user roles</li>
              <li>Access admin panel</li>
              <li>View system analytics</li>
              <li>Configure application settings</li>
            </ul>
          </div>
        </AdminGuard>
      </div>

      {/* User-level content */}
      <div className="bg-card rounded-lg shadow-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          User-Level Section
        </h2>
        
        <UserGuard 
          fallback={
            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-muted-foreground">
                This content requires user-level access.
              </p>
            </div>
          }
        >
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
              👤 User Dashboard
            </h3>
            <p className="text-blue-800 dark:text-blue-300 mb-4">
              Welcome! As an authenticated user, you can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-400">
              <li>View your profile</li>
              <li>Update your preferences</li>
              <li>Access user features</li>
              <li>Interact with the application</li>
            </ul>
          </div>
        </UserGuard>
      </div>

      {/* Custom role check example */}
      <div className="bg-card rounded-lg shadow-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Custom Role Checks
        </h2>
        
        <div className="space-y-4">
          <RoleGuard 
            requiredRole="admin"
            showError
            fallback={
              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-orange-800 dark:text-orange-200">
                  This is a fallback for non-admin users.
                </p>
              </div>
            }
          >
            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">
                ⚙️ Advanced Admin Tools
              </h3>
              <p className="text-purple-800 dark:text-purple-300">
                This section uses custom role guards with error display.
              </p>
            </div>
          </RoleGuard>
        </div>
      </div>

      {/* Implementation examples */}
      <div className="bg-card rounded-lg shadow-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Implementation Examples
        </h2>
        
        <div className="bg-muted border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3">Usage Examples:</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground">1. Component Protection:</h4>
              <code className="block bg-muted-foreground/10 text-foreground p-2 rounded mt-1">
                {`<AdminGuard>
  <AdminPanel />
</AdminGuard>`}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">2. Hook Usage:</h4>
              <code className="block bg-muted-foreground/10 text-foreground p-2 rounded mt-1">
                {`const { isAdmin, canAccessAdmin } = useRoleAccess();
if (canAccessAdmin()) {
  // Show admin features
}`}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">3. Custom Role Check:</h4>
              <code className="block bg-muted-foreground/10 text-foreground p-2 rounded mt-1">
                {`<RoleGuard requiredRole="admin" showError>
  <SensitiveComponent />
</RoleGuard>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
