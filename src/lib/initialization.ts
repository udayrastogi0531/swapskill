// src/lib/initialization.ts
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_SKILL_CATEGORIES } from '@/types';
import type { User, Skill } from '@/types';

// Mock users for demo purposes
const DEMO_USERS: Partial<User>[] = [
  {
    displayName: "Uday Rastogi",
    name: "Uday Prakash Rastogi",
    email: "udayrastogi004@gmail.com",
    role: "user",
    location: "Bhopal, MP, India",
    bio: "Full-stack developer passionate about React and Node.js. Love to teach and learn new technologies!",
    rating: 4.8,
    reviewCount: 23,
    totalSwaps: 15,
    isVerified: true,
    skillsOffered: [],
    skillsWanted: [],
    createdAt: Date.now() - 86400000 * 30, // 30 days ago
    lastLoginAt: Date.now() - 3600000 // 1 hour ago
  },
  {
    displayName: "Aryan",
    name: "Aryan Kumar", 
    email: "aryanak9163@gmail.com",
    role: "user",
    location: "New York, Bihar",
    bio: "UI/UX Designer with 5+ years experience. Skilled in Figma, Adobe Creative Suite, and user research.",
    rating: 4.6,
    reviewCount: 18,
    totalSwaps: 12,
    isVerified: true,
    skillsOffered: [],
    skillsWanted: [],
    createdAt: Date.now() - 86400000 * 45, // 45 days ago
    lastLoginAt: Date.now() - 7200000 // 2 hours ago
  },
  {
    displayName: "Kashish",
    name: "Kashish Singh",
    email: "kashish@yahoo.com", 
    role: "user",
    location: "Austin, HR, India",
    bio: "Digital marketing specialist and content creator. Expert in SEO, social media strategy, and copywriting.",
    rating: 4.9,
    reviewCount: 31,
    totalSwaps: 22,
    isVerified: true,
    skillsOffered: [],
    skillsWanted: [],
    createdAt: Date.now() - 86400000 * 60, // 60 days ago
    lastLoginAt: Date.now() - 1800000 // 30 minutes ago
  },
  {
    displayName: "Paras",
    name: "Paras Wilson",
    email: "paras@example.com",
    role: "user", 
    location: "Seattle, HP, India",
    bio: "Data scientist and machine learning engineer. Python, R, TensorFlow enthusiast who loves sharing knowledge.",
    rating: 4.7,
    reviewCount: 19,
    totalSwaps: 14,
    isVerified: false,
    skillsOffered: [],
    skillsWanted: [],
    createdAt: Date.now() - 86400000 * 20, // 20 days ago
    lastLoginAt: Date.now() - 5400000 // 1.5 hours ago
  }
];

// Demo skills for each user
const DEMO_SKILLS: { [userId: string]: { offered: Partial<Skill>[], wanted: Partial<Skill>[] } } = {
  "alice": {
    offered: [
      { name: "React Development", category: DEFAULT_SKILL_CATEGORIES[0], level: "expert", description: "Advanced React patterns, hooks, state management", tags: ["react", "javascript", "frontend"] },
      { name: "Node.js Backend", category: DEFAULT_SKILL_CATEGORIES[0], level: "advanced", description: "REST APIs, Express, database integration", tags: ["nodejs", "backend", "api"] }
    ],
    wanted: [
      { name: "UI/UX Design", category: DEFAULT_SKILL_CATEGORIES[1], level: "beginner", description: "Learning design principles and user experience", tags: ["design", "ui", "ux"] },
      { name: "Machine Learning", category: DEFAULT_SKILL_CATEGORIES[0], level: "intermediate", description: "Python ML libraries and algorithms", tags: ["python", "ml", "ai"] }
    ]
  },
  "bob": {
    offered: [
      { name: "UI/UX Design", category: DEFAULT_SKILL_CATEGORIES[1], level: "expert", description: "User research, wireframing, prototyping in Figma", tags: ["figma", "design", "ux"] },
      { name: "Graphic Design", category: DEFAULT_SKILL_CATEGORIES[1], level: "advanced", description: "Adobe Creative Suite, branding, illustrations", tags: ["photoshop", "illustrator", "branding"] }
    ],
    wanted: [
      { name: "Frontend Development", category: DEFAULT_SKILL_CATEGORIES[0], level: "intermediate", description: "Want to learn React and modern CSS", tags: ["react", "css", "frontend"] },
      { name: "Photography", category: DEFAULT_SKILL_CATEGORIES[6], level: "beginner", description: "Portrait and product photography basics", tags: ["photography", "camera"] }
    ]
  },
  "carol": {
    offered: [
      { name: "Digital Marketing", category: DEFAULT_SKILL_CATEGORIES[7], level: "expert", description: "SEO, SEM, social media strategy, analytics", tags: ["seo", "marketing", "analytics"] },
      { name: "Content Writing", category: DEFAULT_SKILL_CATEGORIES[7], level: "advanced", description: "Copywriting, blog posts, marketing content", tags: ["writing", "content", "copywriting"] }
    ],
    wanted: [
      { name: "Web Development", category: DEFAULT_SKILL_CATEGORIES[0], level: "beginner", description: "Basic HTML, CSS, and JavaScript", tags: ["html", "css", "javascript"] },
      { name: "Video Editing", category: DEFAULT_SKILL_CATEGORIES[6], level: "intermediate", description: "Adobe Premiere, After Effects", tags: ["video", "editing", "premiere"] }
    ]
  },
  "david": {
    offered: [
      { name: "Data Science", category: DEFAULT_SKILL_CATEGORIES[0], level: "expert", description: "Python, pandas, scikit-learn, data visualization", tags: ["python", "data", "science"] },
      { name: "Machine Learning", category: DEFAULT_SKILL_CATEGORIES[0], level: "advanced", description: "TensorFlow, PyTorch, deep learning", tags: ["ml", "tensorflow", "ai"] }
    ],
    wanted: [
      { name: "Business Strategy", category: DEFAULT_SKILL_CATEGORIES[7], level: "intermediate", description: "Product management and business development", tags: ["business", "strategy", "product"] },
      { name: "Public Speaking", category: DEFAULT_SKILL_CATEGORIES[3], level: "beginner", description: "Presentation skills and communication", tags: ["speaking", "presentation", "communication"] }
    ]
  }
};

export class ProjectInitializer {
  private static instance: ProjectInitializer;
  private initialized = false;

  static getInstance(): ProjectInitializer {
    if (!ProjectInitializer.instance) {
      ProjectInitializer.instance = new ProjectInitializer();
    }
    return ProjectInitializer.instance;
  }

  async initializeProject(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      console.log('🚀 Initializing SwapSkill project...');

      // Check if initialization is needed
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      if (usersSnapshot.empty) {
        console.log('📝 Creating demo users and skills...');
        await this.createDemoData();
        console.log('✅ Demo data created successfully!');
      } else {
        console.log('✅ Project already initialized with', usersSnapshot.size, 'users');
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize project:', error);
      return false;
    }
  }

  private async createDemoData(): Promise<void> {
    const userIds: string[] = [];

    // Create demo users
    for (let i = 0; i < DEMO_USERS.length; i++) {
      const userData = DEMO_USERS[i];
      const userId = `demo_user_${i + 1}`;
      userIds.push(userId);

      const userDoc = {
        ...userData,
        uid: userId,
        id: userId,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.displayName}`,
        profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.displayName}`,
      };

      await setDoc(doc(db, 'users', userId), userDoc);
    }

    // Create demo skills
    const skillIdMap: { [key: string]: string[] } = {};
    
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const userKey = Object.keys(DEMO_SKILLS)[i];
      const userSkills = DEMO_SKILLS[userKey];
      
      skillIdMap[userId] = [];

      // Create offered skills
      for (const skill of userSkills.offered) {
        const skillDoc = {
          ...skill,
          userId,
          type: 'offered',
          createdAt: Date.now()
        };
        
        const skillRef = await addDoc(collection(db, 'skills'), skillDoc);
        skillIdMap[userId].push(skillRef.id);
      }

      // Create wanted skills  
      for (const skill of userSkills.wanted) {
        const skillDoc = {
          ...skill,
          userId,
          type: 'wanted', 
          createdAt: Date.now()
        };
        
        const skillRef = await addDoc(collection(db, 'skills'), skillDoc);
      }
    }

    console.log('✅ Created', userIds.length, 'demo users with skills');
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  reset(): void {
    this.initialized = false;
  }
}

// Export singleton instance
export const projectInitializer = ProjectInitializer.getInstance();
