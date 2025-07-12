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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-yellow-700">
            Please sign in to see the role-based authentication examples.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Role-Based Authentication Demo
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Current User Information
          </h2>
          <div className="space-y-2 text-blue-800">
            <p><strong>Email:</strong> {session?.email}</p>
            <p><strong>Role:</strong> {userRole}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}</p>
            <p><strong>Can Access Admin:</strong> {canAccessAdmin() ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* Admin-only content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Admin-Only Section
        </h2>
        
        <AdminGuard 
          fallback={
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600">
                This content is only visible to administrators.
                You need admin role to view this section.
              </p>
            </div>
          }
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🔒 Admin Dashboard
            </h3>
            <p className="text-green-800 mb-4">
              Congratulations! You have admin access. Here you can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>Manage user roles</li>
              <li>Access admin panel</li>
              <li>View system analytics</li>
              <li>Configure application settings</li>
            </ul>
          </div>
        </AdminGuard>
      </div>

      {/* User-level content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          User-Level Section
        </h2>
        
        <UserGuard 
          fallback={
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600">
                This content requires user-level access.
              </p>
            </div>
          }
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              👤 User Dashboard
            </h3>
            <p className="text-blue-800 mb-4">
              Welcome! As an authenticated user, you can:
            </p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>View your profile</li>
              <li>Update your preferences</li>
              <li>Access user features</li>
              <li>Interact with the application</li>
            </ul>
          </div>
        </UserGuard>
      </div>

      {/* Custom role check example */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Custom Role Checks
        </h2>
        
        <div className="space-y-4">
          <RoleGuard 
            requiredRole="admin"
            showError
            fallback={
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800">
                  This is a fallback for non-admin users.
                </p>
              </div>
            }
          >
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                ⚙️ Advanced Admin Tools
              </h3>
              <p className="text-purple-800">
                This section uses custom role guards with error display.
              </p>
            </div>
          </RoleGuard>
        </div>
      </div>

      {/* Implementation examples */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Implementation Examples
        </h2>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Usage Examples:</h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-800">1. Component Protection:</h4>
              <code className="block bg-gray-100 p-2 rounded mt-1">
                {`<AdminGuard>
  <AdminPanel />
</AdminGuard>`}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800">2. Hook Usage:</h4>
              <code className="block bg-gray-100 p-2 rounded mt-1">
                {`const { isAdmin, canAccessAdmin } = useRoleAccess();
if (canAccessAdmin()) {
  // Show admin features
}`}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800">3. Custom Role Check:</h4>
              <code className="block bg-gray-100 p-2 rounded mt-1">
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
