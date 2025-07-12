import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User, Skill, SwapRequest, Rating, SwapPlatformState, DEFAULT_SKILL_CATEGORIES } from '@/types';

interface SwapPlatformActions {
  // User actions
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  addSkillToUser: (skill: Skill, type: 'offered' | 'wanted') => void;
  removeSkillFromUser: (skillId: string, type: 'offered' | 'wanted') => void;
  
  // Skill actions
  addSkill: (skill: Skill) => void;
  updateSkill: (skillId: string, updates: Partial<Skill>) => void;
  deleteSkill: (skillId: string) => void;
  
  // Swap request actions
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSwapRequest: (requestId: string, updates: Partial<SwapRequest>) => void;
  acceptSwapRequest: (requestId: string) => void;
  declineSwapRequest: (requestId: string) => void;
  completeSwapRequest: (requestId: string) => void;
  
  // Rating actions
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  
  // Search and filter
  searchUsers: (query: string) => User[];
  filterUsersBySkill: (skillName: string) => User[];
  getSwapRequestsForUser: (userId: string) => SwapRequest[];
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: SwapPlatformState = {
  users: [],
  skills: [],
  categories: DEFAULT_SKILL_CATEGORIES,
  swapRequests: [],
  ratings: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const useSwapPlatformStore = create<SwapPlatformState & SwapPlatformActions>()(
  immer((set, get) => ({
    ...initialState,

    // User actions
    setCurrentUser: (user) => {
      set((state) => {
        state.currentUser = user;
      });
    },

    updateUserProfile: (updates) => {
      set((state) => {
        if (state.currentUser) {
          Object.assign(state.currentUser, updates);
          
          // Update in users array as well
          const userIndex = state.users.findIndex(u => u.uid === state.currentUser!.uid);
          if (userIndex !== -1) {
            Object.assign(state.users[userIndex], updates);
          }
        }
      });
    },

    addSkillToUser: (skill, type) => {
      set((state) => {
        if (state.currentUser) {
          if (type === 'offered') {
            state.currentUser.skillsOffered.push(skill);
          } else {
            state.currentUser.skillsWanted.push(skill);
          }
          
          // Update in users array as well
          const userIndex = state.users.findIndex(u => u.uid === state.currentUser!.uid);
          if (userIndex !== -1) {
            if (type === 'offered') {
              state.users[userIndex].skillsOffered.push(skill);
            } else {
              state.users[userIndex].skillsWanted.push(skill);
            }
          }
        }
      });
    },

    removeSkillFromUser: (skillId, type) => {
      set((state) => {
        if (state.currentUser) {
          if (type === 'offered') {
            state.currentUser.skillsOffered = state.currentUser.skillsOffered.filter(s => s.id !== skillId);
          } else {
            state.currentUser.skillsWanted = state.currentUser.skillsWanted.filter(s => s.id !== skillId);
          }
          
          // Update in users array as well
          const userIndex = state.users.findIndex(u => u.uid === state.currentUser!.uid);
          if (userIndex !== -1) {
            if (type === 'offered') {
              state.users[userIndex].skillsOffered = state.users[userIndex].skillsOffered.filter(s => s.id !== skillId);
            } else {
              state.users[userIndex].skillsWanted = state.users[userIndex].skillsWanted.filter(s => s.id !== skillId);
            }
          }
        }
      });
    },

    // Skill actions
    addSkill: (skill) => {
      set((state) => {
        state.skills.push(skill);
      });
    },

    updateSkill: (skillId, updates) => {
      set((state) => {
        const skillIndex = state.skills.findIndex(s => s.id === skillId);
        if (skillIndex !== -1) {
          Object.assign(state.skills[skillIndex], updates);
        }
      });
    },

    deleteSkill: (skillId) => {
      set((state) => {
        state.skills = state.skills.filter(s => s.id !== skillId);
      });
    },

    // Swap request actions
    createSwapRequest: (request) => {
      set((state) => {
        const newRequest: SwapRequest = {
          ...request,
          id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        state.swapRequests.push(newRequest);
      });
    },

    updateSwapRequest: (requestId, updates) => {
      set((state) => {
        const requestIndex = state.swapRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          Object.assign(state.swapRequests[requestIndex], {
            ...updates,
            updatedAt: Date.now(),
          });
        }
      });
    },

    acceptSwapRequest: (requestId) => {
      set((state) => {
        const requestIndex = state.swapRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          state.swapRequests[requestIndex].status = 'accepted';
          state.swapRequests[requestIndex].updatedAt = Date.now();
        }
      });
    },

    declineSwapRequest: (requestId) => {
      set((state) => {
        const requestIndex = state.swapRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          state.swapRequests[requestIndex].status = 'declined';
          state.swapRequests[requestIndex].updatedAt = Date.now();
        }
      });
    },

    completeSwapRequest: (requestId) => {
      set((state) => {
        const requestIndex = state.swapRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          state.swapRequests[requestIndex].status = 'completed';
          state.swapRequests[requestIndex].updatedAt = Date.now();
          
          // Update total swaps for both users
          const request = state.swapRequests[requestIndex];
          const requesterIndex = state.users.findIndex(u => u.uid === request.requesterUid);
          const targetIndex = state.users.findIndex(u => u.uid === request.targetUid);
          
          if (requesterIndex !== -1) {
            state.users[requesterIndex].totalSwaps += 1;
          }
          if (targetIndex !== -1) {
            state.users[targetIndex].totalSwaps += 1;
          }
        }
      });
    },

    // Rating actions
    addRating: (rating) => {
      set((state) => {
        const newRating: Rating = {
          ...rating,
          id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        };
        state.ratings.push(newRating);
        
        // Update user's average rating
        const userRatings = state.ratings.filter(r => r.toUid === rating.toUid);
        const averageRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
        
        const userIndex = state.users.findIndex(u => u.uid === rating.toUid);
        if (userIndex !== -1) {
          state.users[userIndex].rating = averageRating;
        }
        
        if (state.currentUser && state.currentUser.uid === rating.toUid) {
          state.currentUser.rating = averageRating;
        }
      });
    },

    // Search and filter
    searchUsers: (query) => {
      const state = get();
      return state.users.filter(user => 
        user.displayName.toLowerCase().includes(query.toLowerCase()) ||
        user.skillsOffered.some(skill => 
          skill.name.toLowerCase().includes(query.toLowerCase()) ||
          skill.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      );
    },

    filterUsersBySkill: (skillName) => {
      const state = get();
      return state.users.filter(user =>
        user.skillsOffered.some(skill =>
          skill.name.toLowerCase().includes(skillName.toLowerCase())
        )
      );
    },

    getSwapRequestsForUser: (userId) => {
      const state = get();
      return state.swapRequests.filter(request =>
        request.requesterUid === userId || request.targetUid === userId
      );
    },

    // Utility actions
    setLoading: (loading) => {
      set((state) => {
        state.loading = loading;
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },

    reset: () => {
      set(() => initialState);
    },
  }))
);
