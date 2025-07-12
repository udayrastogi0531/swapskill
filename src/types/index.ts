export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  profilePhoto?: string;
  location?: string;
  bio?: string;
  createdAt: number;
  lastLoginAt?: number;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  rating: number;
  totalSwaps: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  description?: string;
  tags: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SwapRequest {
  id: string;
  requesterUid: string;
  targetUid: string;
  offeredSkill: Skill;
  requestedSkill: Skill;
  status: SwapStatus;
  message?: string;
  createdAt: number;
  updatedAt: number;
  scheduledDate?: number;
  location?: string;
  duration?: number; // in minutes
}

export interface Rating {
  id: string;
  fromUid: string;
  toUid: string;
  swapRequestId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: number;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SwapStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export interface SwapPlatformState {
  users: User[];
  skills: Skill[];
  categories: SkillCategory[];
  swapRequests: SwapRequest[];
  ratings: Rating[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

// Default skill categories
export const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming',
    name: 'Programming',
    icon: '💻',
    color: '#3B82F6'
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    color: '#8B5CF6'
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: '#F59E0B'
  },
  {
    id: 'languages',
    name: 'Languages',
    icon: '🗣️',
    color: '#10B981'
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '👨‍🍳',
    color: '#EF4444'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    color: '#F97316'
  },
  {
    id: 'crafts',
    name: 'Crafts',
    icon: '🛠️',
    color: '#6366F1'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    color: '#059669'
  }
];
