"use client";

import { AdminPanel } from "@/components/AdminPanel";
import { RoleBasedExample } from "@/components/RoleBasedExample";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function AdminDemoPage() {
  const { initialize, isHydrated } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Role-Based Authentication Demo
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This demo shows how role-based authentication works with Firebase and Firestore.
            Create an account, make yourself admin, and explore the features.
          </p>
        </div>

        <div className="space-y-8">
          {/* Role-based example */}
          <RoleBasedExample />
          
          {/* Admin Panel */}
          <AdminPanel />
        </div>
      </div>
    </div>
  );
}
