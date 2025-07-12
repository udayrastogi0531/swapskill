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

export interface UserPrefs {
  reputation?: number;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
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

  // Computed properties for backward compatibility
  user: User | null;

  initialize: () => Promise<void>;
  verifySession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  createAccount: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
  updateUserPrefs: (prefs: Partial<UserPrefs>) => Promise<{ success: boolean; error?: any }>;
  refreshUser: () => Promise<void>;
  setConnectionStatus: (status: AuthState["connectionStatus"]) => void;
  setHydrated: () => void;
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
  | "reset"> = {
  session: null,
  userPrefs: null,
  isLoading: false,
  isHydrated: false,
  lastSync: null,
  connectionStatus: "online",
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

                set({
                  session: user,
                  userPrefs,
                  isLoading: false,
                  isHydrated: true,
                  lastSync: Date.now(),
                });
              } else {
                set({ session: null, userPrefs: null, isLoading: false, isHydrated: true });
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

        createAccount: async (name, email, password) => {
          try {
            set({ isLoading: true });
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            const userDoc = doc(db, "users", userCredential.user.uid);
            await setDoc(userDoc, { displayName: name, email }, { merge: true });

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

          set({
            userPrefs,
            lastSync: Date.now(),
          });
        },
        setConnectionStatus: (status) => {
          set({ connectionStatus: status });
        },
        setHydrated: () => {
          set({ isHydrated: true });
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