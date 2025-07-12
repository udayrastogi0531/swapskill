"use client";

import { collection, getDocs, doc, setDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface SetupAdminResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface GetAllUsersResult {
  success: boolean;
  users?: any[];
  error?: string;
}

/**
 * Sets up the first admin user in the system
 * This updates the user's role in Firestore
 */
export async function setupFirstAdmin(email: string, currentUserId?: string): Promise<SetupAdminResult> {
  try {
    if (!currentUserId) {
      return {
        success: false,
        error: "User must be authenticated to setup admin"
      };
    }

    // Update current user's role to admin
    const userDoc = doc(db, "users", currentUserId);
    await setDoc(userDoc, { 
      role: "admin",
      isFirstAdmin: true,
      adminSince: Date.now(),
      email: email
    }, { merge: true });
    
    return {
      success: true,
      message: "Admin setup successful! Please refresh to see changes."
    };
  } catch (error: any) {
    console.error("Error setting up first admin:", error);
    return {
      success: false,
      error: error.message || "Failed to setup first admin"
    };
  }
}

/**
 * Gets all users in the system
 * Uses Firestore queries instead of Cloud Functions
 */
export async function getAllUsers(): Promise<GetAllUsersResult> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("email"));
    const querySnapshot = await getDocs(q);
    
    const users = querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      users: users
    };
  } catch (error: any) {
    console.error("Error getting all users:", error);
    return {
      success: false,
      error: error.message || "Failed to get users"
    };
  }
}

/**
 * Utility to check if a user has admin role from Firestore
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const userDoc = doc(db, "users", userId);
    const userSnap = await getDocs(query(collection(db, "users")));
    const userData = userSnap.docs.find(doc => doc.id === userId)?.data();
    return userData?.role === "admin";
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Simple token refresh (client-side only)
 */
export async function refreshUserToken(user: any): Promise<void> {
  try {
    await user.getIdToken(true); // Force refresh
  } catch (error) {
    console.error("Error refreshing user token:", error);
  }
}
