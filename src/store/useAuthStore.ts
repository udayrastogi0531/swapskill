// src/stores/useAuthStore.ts
"use client";

import { create } from "zustand";
import { devtools, persist,createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Cookies from "js-cookie";

// -- Types ----------------------------------------------------------------

export type UserRole = "user" | "admin";

export interface UserPrefs {
  reputation?: number;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  role?: UserRole;
  createdAt?: number;
  lastLoginAt?: number;
  preferences?: {
    theme: "light" | "dark" | "system";
    notifications: Record<"email"|"push"|"answers"|"votes"|"mentions", boolean>;
    privacy: Record<"showEmail"|"showLocation"|"showActivity", boolean>;
  };
}

export interface AuthState {
  session: User | null;
  userPrefs: UserPrefs | null;
  isLoading: boolean;
  isHydrated: boolean;
  lastSync: number | null;
  connectionStatus: "online" | "offline" | "reconnecting";
  userRole: UserRole | null;
  isAdmin: boolean;

  // Computed properties for backward compatibility
  user: User | null;

  initialize: () => Promise<void>;
  verifySession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  createAccount: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
  updateUserPrefs: (prefs: Partial<UserPrefs>) => Promise<{ success: boolean; error?: any }>;
  refreshUser: () => Promise<void>;
  setConnectionStatus: (status: AuthState["connectionStatus"]) => void;
  setHydrated: () => void;
  checkUserRole: () => Promise<UserRole | null>;
  hasRole: (role: UserRole) => boolean;
  requireRole: (role: UserRole) => boolean;
  promoteToAdmin: (userId: string) => Promise<{ success: boolean; error?: any }>;
  demoteFromAdmin: (userId: string) => Promise<{ success: boolean; error?: any }>;
  setTestAdminRole: () => void; // For demo/testing purposes
  reset: () => void;
}

// -- Initial --------------------------------------------------------------

const initialState: Omit<AuthState, 
  | "initialize"
  | "verifySession" 
  | "login" 
  | "createAccount" 
  | "logout" 
  | "signOut"
  | "updateUserPrefs" 
  | "refreshUser" 
  | "setConnectionStatus" 
  | "setHydrated" 
  | "checkUserRole"
  | "hasRole"
  | "requireRole"
  | "promoteToAdmin"
  | "demoteFromAdmin"
  | "setTestAdminRole"
  | "reset"> = {
  session: null,
  userPrefs: null,
  isLoading: false,
  isHydrated: false,
  lastSync: null,
  connectionStatus: "online",
  userRole: null,
  isAdmin: false,
  user: null, // Computed property for backward compatibility
};

// -- Store ----------------------------------------------------------------

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Computed property for backward compatibility
        get user() {
          return get().session;
        },

        initialize: async () => {
          await get().verifySession();
        },

        verifySession: async () => {
          set({ isLoading: true });
          return new Promise<void>((resolve) => {
            onAuthStateChanged(auth, async (user) => {
              if (user) {
                const userDoc = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDoc);
                const userPrefs = userSnap.exists() ? (userSnap.data() as UserPrefs) : null;

                // Get user role from custom claims or userPrefs
                const idTokenResult = await user.getIdTokenResult();
                const roleFromClaims = idTokenResult.claims.role as UserRole;
                const userRole = roleFromClaims || userPrefs?.role || "user";
                const isAdmin = userRole === "admin";

                set({
                  session: user,
                  userPrefs,
                  userRole,
                  isAdmin,
                  isLoading: false,
                  isHydrated: true,
                  lastSync: Date.now(),
                });
              } else {
                set({ 
                  session: null, 
                  userPrefs: null, 
                  userRole: null,
                  isAdmin: false,
                  isLoading: false, 
                  isHydrated: true 
                });
              }
              resolve();
            });
          });
        },

        login: async (email, password) => {
          try {
            set({ isLoading: true });
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
          } catch (error) {
            console.error("Login error:", error);
            return { success: false, error };
          } finally {
            set({ isLoading: false });
          }
        },

        createAccount: async (name, email, password, role = "user") => {
          try {
            set({ isLoading: true });
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            const userDoc = doc(db, "users", userCredential.user.uid);
            const userData = { 
              displayName: name, 
              email, 
              role,
              createdAt: Date.now(),
              lastLoginAt: Date.now()
            };
            await setDoc(userDoc, userData, { merge: true });

            return { success: true };
          } catch (error) {
            console.error("Create account error:", error);
            return { success: false, error };
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          try {
            await fbSignOut(auth);
            Cookies.remove("authToken");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },

        signOut: async () => {
          // Alias for logout for backward compatibility
          await get().logout();
        },

        updateUserPrefs: async (prefs) => {
          try {
            const user = get().session!;
            const merged = { ...(get().userPrefs || {}), ...prefs };
            await setDoc(doc(db, "profiles", user.uid), merged, { merge: true });
            set((s) => {
              s.userPrefs = merged;
              s.lastSync = Date.now();
            });
            return { success: true };
          } catch (error) {
            return { success: false, error };
          }
        },
        refreshUser: async () => {
          const user = get().session;
          if (!user) return;

          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);
          const userPrefs = userSnap.exists() ? (userSnap.data() as UserPrefs) : null;

          // Update role information
          const idTokenResult = await user.getIdTokenResult();
          const roleFromClaims = idTokenResult.claims.role as UserRole;
          const userRole = roleFromClaims || userPrefs?.role || "user";
          const isAdmin = userRole === "admin";

          set({
            userPrefs,
            userRole,
            isAdmin,
            lastSync: Date.now(),
          });
        },

        checkUserRole: async () => {
          const user = get().session;
          if (!user) return null;

          try {
            const idTokenResult = await user.getIdTokenResult();
            const roleFromClaims = idTokenResult.claims.role as UserRole;
            
            if (roleFromClaims) {
              return roleFromClaims;
            }

            // Fallback to Firestore if no custom claims
            const userDoc = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDoc);
            const userPrefs = userSnap.exists() ? (userSnap.data() as UserPrefs) : null;
            
            return userPrefs?.role || "user";
          } catch (error) {
            console.error("Error checking user role:", error);
            return "user";
          }
        },

        hasRole: (role) => {
          const currentRole = get().userRole;
          if (!currentRole) return false;
          
          // Admin has access to all roles
          if (currentRole === "admin") return true;
          
          return currentRole === role;
        },

        requireRole: (role) => {
          const hasRequiredRole = get().hasRole(role);
          if (!hasRequiredRole) {
            console.warn(`Access denied. Required role: ${role}, Current role: ${get().userRole}`);
          }
          return hasRequiredRole;
        },

        promoteToAdmin: async (userId) => {
          try {
            const currentUser = get().session;
            if (!currentUser || !get().isAdmin) {
              return { success: false, error: "Unauthorized: Admin access required" };
            }

            // Update user document in Firestore
            const userDoc = doc(db, "users", userId);
            await setDoc(userDoc, { 
              role: "admin",
              promotedAt: Date.now(),
              promotedBy: currentUser.uid
            }, { merge: true });

            // Note: Without Cloud Functions, custom claims won't be set automatically
            // Role changes will take effect after the user refreshes their session
            return { success: true };
          } catch (error: any) {
            console.error("Error promoting user to admin:", error);
            return { 
              success: false, 
              error: error.message || "Failed to promote user" 
            };
          }
        },

        demoteFromAdmin: async (userId) => {
          try {
            const currentUser = get().session;
            if (!currentUser || !get().isAdmin) {
              return { success: false, error: "Unauthorized: Admin access required" };
            }

            // Prevent self-demotion
            if (currentUser.uid === userId) {
              return { success: false, error: "Cannot demote yourself" };
            }

            // Update user document in Firestore
            const userDoc = doc(db, "users", userId);
            await setDoc(userDoc, { 
              role: "user",
              demotedAt: Date.now(),
              demotedBy: currentUser.uid
            }, { merge: true });

            // Note: Without Cloud Functions, custom claims won't be removed automatically
            // Role changes will take effect after the user refreshes their session
            return { success: true };
          } catch (error: any) {
            console.error("Error demoting user from admin:", error);
            return { 
              success: false, 
              error: error.message || "Failed to demote user" 
            };
          }
        },
        setConnectionStatus: (status) => {
          set({ connectionStatus: status });
        },
        setHydrated: () => {
          set({ isHydrated: true });
        },

        // Test/Demo method to switch to admin role
        setTestAdminRole: () => {
          set((state) => {
            state.userRole = "admin";
            state.isAdmin = true;
            if (state.userPrefs) {
              state.userPrefs.role = "admin";
            }
          });
        },

        reset: () => {
          set({
            ...initialState,
            isHydrated: get().isHydrated, // Preserve hydration state
          });
        }
      
      }
      )
    ),{
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }),
    {
      name: "auth-store",
      enabled:process.env.NODE_ENV === "development",
    }
))