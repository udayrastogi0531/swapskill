"use client";

import React, { useState, useEffect } from "react";
import { AdminGuard } from "@/components/RoleGuard";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuthStore } from "@/store/useAuthStore";
import { getAllUsers, setupFirstAdmin } from "@/utils/adminUtils";

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt?: number;
  lastLoginAt?: number;
  promotedAt?: any;
  demotedAt?: any;
}

export function AdminPanel() {
  const { promoteUserToAdmin, demoteUserFromAdmin } = useRoleAccess();
  const { session } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupEmail, setSetupEmail] = useState("");

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllUsers();
      
      if (result.success && result.users) {
        setUsers(result.users);
      } else {
        setError(result.error || "Failed to load users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await promoteUserToAdmin(userId);
      
      if (result.success) {
        // Reload users to reflect changes
        await loadUsers();
        alert("User promoted to admin successfully!");
      } else {
        setError(result.error || "Failed to promote user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoteUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await demoteUserFromAdmin(userId);
      
      if (result.success) {
        // Reload users to reflect changes
        await loadUsers();
        alert("User demoted from admin successfully!");
      } else {
        setError(result.error || "Failed to demote user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupFirstAdmin = async () => {
    if (!setupEmail.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (!session?.uid) {
      setError("You must be logged in to setup admin");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await setupFirstAdmin(setupEmail, session.uid);
      
      if (result.success) {
        alert(result.message || "First admin setup successful!");
        setSetupEmail("");
        await loadUsers();
      } else {
        setError(result.error || "Failed to setup first admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard showError>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg border border-border">
          <div className="border-b border-border px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">
              Manage users and their roles. Only administrators can access this panel.
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive">{error}</p>
              </div>
            )}

            {/* Current Admin Info */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Current Admin</h2>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      {session?.displayName || "Admin User"}
                    </p>
                    <p className="text-green-700 dark:text-green-300">{session?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Setup First Admin */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Setup Admin Access</h2>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  Click the button below to promote your current account to admin status.
                  Enter your email address for confirmation.
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={setupEmail}
                    onChange={(e) => setSetupEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSetupFirstAdmin}
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    {loading ? "Setting up..." : "Make Me Admin"}
                  </button>
                </div>
              </div>
            </div>

            {/* User Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">User Management</h2>
                <button
                  onClick={loadUsers}
                  disabled={loading}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {loading && users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="bg-muted border border-border rounded-lg p-4">
                  <p className="text-muted-foreground">No users found.</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.uid}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {user.displayName || "No name"}
                              </div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                              }`}
                            >
                              {user.role || "user"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.uid !== session?.uid && (
                              <div className="flex gap-2">
                                {user.role !== "admin" ? (
                                  <button
                                    onClick={() => handlePromoteUser(user.uid)}
                                    disabled={loading}
                                    className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 disabled:opacity-50"
                                  >
                                    Promote to Admin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDemoteUser(user.uid)}
                                    disabled={loading}
                                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                                  >
                                    Demote from Admin
                                  </button>
                                )}
                              </div>
                            )}
                            {user.uid === session?.uid && (
                              <span className="text-muted-foreground">Current User</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
