// lib/firestore.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";
import { db } from "./firebase";
import type { User, Skill, SwapRequest, Rating, Message, Conversation } from "@/types";

// Collection references
const COLLECTIONS = {
  USERS: "users",
  SKILLS: "skills", 
  SWAP_REQUESTS: "swapRequests",
  RATINGS: "ratings",
  CONVERSATIONS: "conversations",
  MESSAGES: "messages"
} as const;

// User Management
export const userService = {
  // Create user profile
  async createUserProfile(userId: string, userData: Partial<User>) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const profileData = {
      ...userData,
      uid: userId,
      id: userId,
      name: userData.displayName || userData.name || '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      skillsOffered: [],
      skillsWanted: [],
      rating: 0,
      reviewCount: 0,
      totalSwaps: 0,
      isVerified: false
    };
    
    await setDoc(userRef, profileData);
    return profileData;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User;
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Search users by skills or location
  async searchUsers(searchQuery?: string, skillCategory?: string, location?: string) {
    let q = query(collection(db, COLLECTIONS.USERS));

    if (skillCategory) {
      q = query(q, where("skillsOffered.category", "array-contains", skillCategory));
    }

    if (location) {
      q = query(q, where("location", ">=", location), where("location", "<=", location + "\uf8ff"));
    }

    q = query(q, orderBy("rating", "desc"), limit(20));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  }
};

// Skill Management
export const skillService = {
  // Add skill to user
  async addSkillToUser(userId: string, skill: Omit<Skill, "id">, type: "offered" | "wanted") {
    const skillRef = await addDoc(collection(db, COLLECTIONS.SKILLS), {
      ...skill,
      userId,
      type,
      createdAt: serverTimestamp()
    });

    // Update user's skill arrays
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const fieldName = type === "offered" ? "skillsOffered" : "skillsWanted";
    
    await updateDoc(userRef, {
      [fieldName]: arrayUnion(skillRef.id)
    });

    return skillRef.id;
  },

  // Remove skill from user
  async removeSkillFromUser(userId: string, skillId: string, type: "offered" | "wanted") {
    // Delete skill document
    await deleteDoc(doc(db, COLLECTIONS.SKILLS, skillId));

    // Update user's skill arrays
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const fieldName = type === "offered" ? "skillsOffered" : "skillsWanted";
    
    await updateDoc(userRef, {
      [fieldName]: arrayRemove(skillId)
    });
  },

  // Get user's skills
  async getUserSkills(userId: string, type?: "offered" | "wanted") {
    let q = query(
      collection(db, COLLECTIONS.SKILLS),
      where("userId", "==", userId)
    );

    if (type) {
      q = query(q, where("type", "==", type));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Skill[];
  }
};

// Swap Request Management
export const swapRequestService = {
  // Create swap request
  async createSwapRequest(requestData: Omit<SwapRequest, "id" | "createdAt" | "updatedAt">) {
    const requestRef = await addDoc(collection(db, COLLECTIONS.SWAP_REQUESTS), {
      ...requestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return requestRef.id;
  },

  // Update swap request status
  async updateSwapRequestStatus(requestId: string, status: SwapRequest["status"], adminNotes?: string) {
    const requestRef = doc(db, COLLECTIONS.SWAP_REQUESTS, requestId);
    const updates: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (adminNotes) {
      updates.adminNotes = adminNotes;
    }

    await updateDoc(requestRef, updates);
  },

  // Get swap requests for user
  async getUserSwapRequests(userId: string, type?: "incoming" | "outgoing") {
    let q;
    
    if (type === "incoming") {
      q = query(
        collection(db, COLLECTIONS.SWAP_REQUESTS),
        where("responderId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else if (type === "outgoing") {
      q = query(
        collection(db, COLLECTIONS.SWAP_REQUESTS),
        where("requesterId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else {
      // Get both incoming and outgoing
      // Note: This requires multiple queries in Firestore
      const [incoming, outgoing] = await Promise.all([
        getDocs(query(
          collection(db, COLLECTIONS.SWAP_REQUESTS),
          where("responderId", "==", userId),
          orderBy("createdAt", "desc")
        )),
        getDocs(query(
          collection(db, COLLECTIONS.SWAP_REQUESTS),
          where("requesterId", "==", userId),
          orderBy("createdAt", "desc")
        ))
      ]);

      const incomingRequests = incoming.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
      }));

      const outgoingRequests = outgoing.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
      }));

      return [...incomingRequests, ...outgoingRequests].sort((a, b) => 
        b.createdAt - a.createdAt
      ) as SwapRequest[];
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toMillis() || Date.now(),
      updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
    })) as SwapRequest[];
  },

  // Get all swap requests (admin)
  async getAllSwapRequests(status?: SwapRequest["status"], priority?: string) {
    let q = query(
      collection(db, COLLECTIONS.SWAP_REQUESTS),
      orderBy("createdAt", "desc")
    );

    if (status) {
      q = query(q, where("status", "==", status));
    }

    if (priority) {
      q = query(q, where("priority", "==", priority));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SwapRequest[];
  },

  // Subscribe to swap request updates
  subscribeToSwapRequests(
    userId: string, 
    callback: (requests: SwapRequest[]) => void,
    type?: "incoming" | "outgoing"
  ): Unsubscribe {
    let q;
    
    if (type === "incoming") {
      q = query(
        collection(db, COLLECTIONS.SWAP_REQUESTS),
        where("responderId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, COLLECTIONS.SWAP_REQUESTS),
        where("requesterId", "==", userId),
        orderBy("createdAt", "desc")
      );
    }

    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis() || Date.now(),
        updatedAt: doc.data().updatedAt?.toMillis() || Date.now()
      })) as SwapRequest[];
      
      callback(requests);
    });
  }
};

// Rating System
export const ratingService = {
  // Add rating/review
  async addRating(ratingData: Omit<Rating, "id" | "createdAt">) {
    const ratingRef = await addDoc(collection(db, COLLECTIONS.RATINGS), {
      ...ratingData,
      createdAt: serverTimestamp()
    });

    // Update user's rating average
    await this.updateUserRating(ratingData.toUid);

    return ratingRef.id;
  },

  // Get user ratings
  async getUserRatings(userId: string) {
    const q = query(
      collection(db, COLLECTIONS.RATINGS),
      where("ratedUserId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Rating[];
  },

  // Update user's overall rating
  async updateUserRating(userId: string) {
    const ratings = await this.getUserRatings(userId);
    
    if (ratings.length > 0) {
      const averageRating = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
      
      await userService.updateUserProfile(userId, {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: ratings.length
      });
    }
  }
};

// Messaging System
export const messageService = {
  // Create conversation
  async createConversation(participants: string[], swapRequestId?: string) {
    const conversationRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
      participants,
      swapRequestId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null
    });

    return conversationRef.id;
  },

  // Send message
  async sendMessage(conversationId: string, senderId: string, content: string, type: "text" | "image" = "text") {
    const messageRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      conversationId,
      senderId,
      content,
      type,
      createdAt: serverTimestamp(),
      isRead: false
    });

    // Update conversation's last message
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(conversationRef, {
      lastMessage: {
        content,
        senderId,
        createdAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });

    return messageRef.id;
  },

  // Get user conversations
  async getUserConversations(userId: string) {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS),
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Conversation[];
  },

  // Get conversation messages
  async getConversationMessages(conversationId: string) {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
  },

  // Subscribe to conversation messages
  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      callback(messages);
    });
  },

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string) {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where("conversationId", "==", conversationId),
      where("senderId", "!=", userId),
      where("isRead", "==", false)
    );

    const querySnapshot = await getDocs(q);
    const batch = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isRead: true })
    );

    await Promise.all(batch);
  }
};
