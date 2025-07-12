// src/store/useFirebaseStore.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { User, Skill, SwapRequest, Rating, Message, Conversation } from "@/types";
import { 
  userService, 
  skillService, 
  swapRequestService, 
  ratingService, 
  messageService 
} from "@/lib/firestore";

interface FirebaseState {
  // Users
  users: User[];
  currentUserProfile: User | null;
  isLoadingUsers: boolean;

  // Skills
  userSkills: { offered: Skill[]; wanted: Skill[] };
  isLoadingSkills: boolean;

  // Swap Requests
  swapRequests: SwapRequest[];
  adminRequests: SwapRequest[]; // For admin dashboard
  isLoadingRequests: boolean;

  // Messages
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  activeConversation: string | null;
  isLoadingMessages: boolean;

  // Search & Filters
  searchQuery: string;
  selectedCategory: string;
  selectedLocation: string;
  searchResults: User[];

  // Error handling
  error: string | null;

  // Actions
  // User actions
  loadUsers: (searchQuery?: string, category?: string, location?: string) => Promise<void>;
  loadCurrentUserProfile: (userId: string) => Promise<void>;
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  searchUsers: (query?: string, category?: string, location?: string) => Promise<void>;

  // Skill actions
  loadUserSkills: (userId: string, type?: "offered" | "wanted") => Promise<void>;
  addSkill: (userId: string, skill: Omit<Skill, "id">, type: "offered" | "wanted") => Promise<void>;
  removeSkill: (userId: string, skillId: string, type: "offered" | "wanted") => Promise<void>;

  // Swap request actions
  loadSwapRequests: (userId: string, type?: "incoming" | "outgoing") => Promise<void>;
  createSwapRequest: (requestData: Omit<SwapRequest, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateSwapRequestStatus: (requestId: string, status: SwapRequest["status"], adminNotes?: string) => Promise<void>;
  loadAllSwapRequests: (status?: SwapRequest["status"], priority?: string) => Promise<void>; // For admin

  // Rating actions
  addRating: (ratingData: Omit<Rating, "id" | "createdAt">) => Promise<void>;
  loadUserRatings: (userId: string) => Promise<Rating[]>;

  // Message actions
  loadConversations: (userId: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, senderId: string, content: string) => Promise<void>;
  createConversation: (participants: string[], swapRequestId?: string) => Promise<string>;
  setActiveConversation: (conversationId: string | null) => void;

  // Search & Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedLocation: (location: string) => void;
  clearFilters: () => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

const initialState = {
  users: [],
  currentUserProfile: null,
  isLoadingUsers: false,
  userSkills: { offered: [], wanted: [] },
  isLoadingSkills: false,
  swapRequests: [],
  adminRequests: [],
  isLoadingRequests: false,
  conversations: [],
  messages: {},
  activeConversation: null,
  isLoadingMessages: false,
  searchQuery: "",
  selectedCategory: "",
  selectedLocation: "",
  searchResults: [],
  error: null,
};

export const useFirebaseStore = create<FirebaseState>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // User actions
      loadUsers: async (searchQuery, category, location) => {
        try {
          set({ isLoadingUsers: true, error: null });
          const users = await userService.searchUsers(searchQuery, category, location);
          set({ users, searchResults: users });
        } catch (error: any) {
          console.error("Error loading users:", error);
          set({ error: error.message || "Failed to load users" });
        } finally {
          set({ isLoadingUsers: false });
        }
      },

      loadCurrentUserProfile: async (userId) => {
        try {
          set({ error: null });
          const profile = await userService.getUserProfile(userId);
          set({ currentUserProfile: profile });
        } catch (error: any) {
          console.error("Error loading user profile:", error);
          set({ error: error.message || "Failed to load profile" });
        }
      },

      updateUserProfile: async (userId, updates) => {
        try {
          set({ error: null });
          await userService.updateUserProfile(userId, updates);
          
          // Update local state
          set((state) => {
            if (state.currentUserProfile?.id === userId) {
              state.currentUserProfile = { ...state.currentUserProfile, ...updates };
            }
            
            const userIndex = state.users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
              state.users[userIndex] = { ...state.users[userIndex], ...updates };
            }
          });
        } catch (error: any) {
          console.error("Error updating user profile:", error);
          set({ error: error.message || "Failed to update profile" });
        }
      },

      searchUsers: async (query, category, location) => {
        try {
          set({ isLoadingUsers: true, error: null });
          const users = await userService.searchUsers(query, category, location);
          set({ searchResults: users });
        } catch (error: any) {
          console.error("Error searching users:", error);
          set({ error: error.message || "Failed to search users" });
        } finally {
          set({ isLoadingUsers: false });
        }
      },

      // Skill actions
      loadUserSkills: async (userId, type) => {
        try {
          set({ isLoadingSkills: true, error: null });
          const skills = await skillService.getUserSkills(userId, type);
          
          set((state) => {
            if (type === "offered") {
              state.userSkills.offered = skills;
            } else if (type === "wanted") {
              state.userSkills.wanted = skills;
            } else {
              // Load both            // Note: Skills categorization will be handled in user profile
            state.userSkills.offered = skills;
            state.userSkills.wanted = [];
            }
          });
        } catch (error: any) {
          console.error("Error loading user skills:", error);
          set({ error: error.message || "Failed to load skills" });
        } finally {
          set({ isLoadingSkills: false });
        }
      },

      addSkill: async (userId, skill, type) => {
        try {
          set({ error: null });
          const skillId = await skillService.addSkillToUser(userId, skill, type);
          
          // Update local state
          const newSkill = { ...skill, id: skillId, userId, type };
          set((state) => {
            if (type === "offered") {
              state.userSkills.offered.push(newSkill);
            } else {
              state.userSkills.wanted.push(newSkill);
            }
          });
        } catch (error: any) {
          console.error("Error adding skill:", error);
          set({ error: error.message || "Failed to add skill" });
        }
      },

      removeSkill: async (userId, skillId, type) => {
        try {
          set({ error: null });
          await skillService.removeSkillFromUser(userId, skillId, type);
          
          // Update local state
          set((state) => {
            if (type === "offered") {
              state.userSkills.offered = state.userSkills.offered.filter(s => s.id !== skillId);
            } else {
              state.userSkills.wanted = state.userSkills.wanted.filter(s => s.id !== skillId);
            }
          });
        } catch (error: any) {
          console.error("Error removing skill:", error);
          set({ error: error.message || "Failed to remove skill" });
        }
      },

      // Swap request actions
      loadSwapRequests: async (userId, type) => {
        try {
          set({ isLoadingRequests: true, error: null });
          const requests = await swapRequestService.getUserSwapRequests(userId, type);
          set({ swapRequests: requests });
        } catch (error: any) {
          console.error("Error loading swap requests:", error);
          set({ error: error.message || "Failed to load requests" });
        } finally {
          set({ isLoadingRequests: false });
        }
      },

      createSwapRequest: async (requestData) => {
        try {
          set({ error: null });
          const requestId = await swapRequestService.createSwapRequest(requestData);
          
          // Add to local state
          const newRequest = {
            ...requestData,
            id: requestId,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          
          set((state) => {
            state.swapRequests.push(newRequest);
          });
        } catch (error: any) {
          console.error("Error creating swap request:", error);
          set({ error: error.message || "Failed to create request" });
        }
      },

      updateSwapRequestStatus: async (requestId, status, adminNotes) => {
        try {
          set({ error: null });
          await swapRequestService.updateSwapRequestStatus(requestId, status, adminNotes);
          
          // Update local state
          set((state) => {
            const requestIndex = state.swapRequests.findIndex(r => r.id === requestId);
            if (requestIndex !== -1) {
              state.swapRequests[requestIndex].status = status;
              state.swapRequests[requestIndex].updatedAt = Date.now();
              if (adminNotes) {
                state.swapRequests[requestIndex].adminNotes = adminNotes;
              }
            }
            
            const adminRequestIndex = state.adminRequests.findIndex(r => r.id === requestId);
            if (adminRequestIndex !== -1) {
              state.adminRequests[adminRequestIndex].status = status;
              state.adminRequests[adminRequestIndex].updatedAt = Date.now();
              if (adminNotes) {
                state.adminRequests[adminRequestIndex].adminNotes = adminNotes;
              }
            }
          });
        } catch (error: any) {
          console.error("Error updating swap request:", error);
          set({ error: error.message || "Failed to update request" });
        }
      },

      loadAllSwapRequests: async (status, priority) => {
        try {
          set({ isLoadingRequests: true, error: null });
          const requests = await swapRequestService.getAllSwapRequests(status, priority);
          set({ adminRequests: requests });
        } catch (error: any) {
          console.error("Error loading admin requests:", error);
          set({ error: error.message || "Failed to load admin requests" });
        } finally {
          set({ isLoadingRequests: false });
        }
      },

      // Rating actions
      addRating: async (ratingData) => {
        try {
          set({ error: null });
          await ratingService.addRating(ratingData);
        } catch (error: any) {
          console.error("Error adding rating:", error);
          set({ error: error.message || "Failed to add rating" });
        }
      },

      loadUserRatings: async (userId) => {
        try {
          set({ error: null });
          const ratings = await ratingService.getUserRatings(userId);
          return ratings;
        } catch (error: any) {
          console.error("Error loading ratings:", error);
          set({ error: error.message || "Failed to load ratings" });
          return [];
        }
      },

      // Message actions
      loadConversations: async (userId) => {
        try {
          set({ isLoadingMessages: true, error: null });
          const conversations = await messageService.getUserConversations(userId);
          set({ conversations });
        } catch (error: any) {
          console.error("Error loading conversations:", error);
          set({ error: error.message || "Failed to load conversations" });
        } finally {
          set({ isLoadingMessages: false });
        }
      },

      loadMessages: async (conversationId) => {
        try {
          set({ error: null });
          const messages = await messageService.getConversationMessages(conversationId);
          set((state) => {
            state.messages[conversationId] = messages;
          });
        } catch (error: any) {
          console.error("Error loading messages:", error);
          set({ error: error.message || "Failed to load messages" });
        }
      },

      sendMessage: async (conversationId, senderId, content) => {
        try {
          set({ error: null });
          const messageId = await messageService.sendMessage(conversationId, senderId, content);
          
          // Add to local state
          const newMessage = {
            id: messageId,
            conversationId,
            senderId,
            content,
            timestamp: Date.now(),
            read: false
          };
          
          set((state) => {
            if (!state.messages[conversationId]) {
              state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(newMessage);
          });
        } catch (error: any) {
          console.error("Error sending message:", error);
          set({ error: error.message || "Failed to send message" });
        }
      },

      createConversation: async (participants, swapRequestId) => {
        try {
          set({ error: null });
          const conversationId = await messageService.createConversation(participants, swapRequestId);
          
          // Add to local state
          const newConversation = {
            id: conversationId,
            participants,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastMessage: undefined
          };
          
          set((state) => {
            state.conversations.push(newConversation);
          });
          
          return conversationId;
        } catch (error: any) {
          console.error("Error creating conversation:", error);
          set({ error: error.message || "Failed to create conversation" });
          throw error;
        }
      },

      setActiveConversation: (conversationId) => {
        set({ activeConversation: conversationId });
      },

      // Search & Filter actions
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },

      setSelectedLocation: (location) => {
        set({ selectedLocation: location });
      },

      clearFilters: () => {
        set({
          searchQuery: "",
          selectedCategory: "",
          selectedLocation: "",
          searchResults: []
        });
      },

      // Error handling
      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Reset
      reset: () => {
        set(initialState);
      }
    })),
    {
      name: "firebase-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
