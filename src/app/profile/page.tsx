"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import { useFirebaseStore } from "@/store/useFirebaseStore";
import { DEFAULT_SKILL_CATEGORIES } from "@/types";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { AddSkillDialog } from "@/components/profile/AddSkillDialog";
import { Loader2 } from "lucide-react";
import type { Skill } from "@/types";

export default function ProfilePage() {
  const { session, userPrefs } = useAuthStore();
  const {
    currentUserProfile,
    userSkills,
    isLoadingUsers,
    isLoadingSkills,
    loadCurrentUserProfile,
    loadUserSkills,
    updateUserProfile,
    addSkill,
    removeSkill,
    error
  } = useFirebaseStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [skillType, setSkillType] = useState<'offered' | 'wanted'>('offered');
  const [formData, setFormData] = useState({
    displayName: "",
    location: "",
    bio: "",
  });
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    level: "beginner" as const
  });

  // Load user data when session is available
  useEffect(() => {
    if (session?.uid) {
      console.log('Profile: Loading data for user:', session.uid);
      loadCurrentUserProfile(session.uid);
      loadUserSkills(session.uid);
    }
  }, [session?.uid, loadCurrentUserProfile, loadUserSkills]);

  // Update form data when profile loads
  useEffect(() => {
    if (currentUserProfile) {
      setFormData({
        displayName: currentUserProfile.displayName || "",
        location: currentUserProfile.location || "",
        bio: currentUserProfile.bio || "",
      });
    }
  }, [currentUserProfile]);

  const handleSave = async () => {
    if (!session?.uid) return;
    
    try {
      await updateUserProfile(session.uid, {
        displayName: formData.displayName,
        location: formData.location,
        bio: formData.bio,
      });
      setIsEditing(false);
      // Reload profile to get updated data
      loadCurrentUserProfile(session.uid);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDiscard = () => {
    if (currentUserProfile) {
      setFormData({
        displayName: currentUserProfile.displayName || "",
        location: currentUserProfile.location || "",
        bio: currentUserProfile.bio || "",
      });
    }
    setIsEditing(false);
  };

  const handleAddSkill = async () => {
    if (!session?.uid || !newSkill.name || !newSkill.category) return;

    const selectedCategory = DEFAULT_SKILL_CATEGORIES.find(cat => cat.id === newSkill.category);
    if (!selectedCategory) return;

    const skillData: Omit<Skill, "id"> = {
      name: newSkill.name,
      category: selectedCategory,
      level: newSkill.level,
      description: "",
      tags: [newSkill.name.toLowerCase()]
    };

    try {
      await addSkill(session.uid, skillData, skillType);
      setNewSkill({ name: "", category: "", level: "beginner" });
      setShowAddSkill(false);
      // Reload skills to get updated data
      loadUserSkills(session.uid);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleRemoveSkill = async (skillId: string, type: 'offered' | 'wanted') => {
    if (!session?.uid) return;

    try {
      await removeSkill(session.uid, skillId, type);
      // Reload skills to get updated data
      loadUserSkills(session.uid);
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const handleSkillChange = (field: string, value: string) => {
    setNewSkill(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelAddSkill = () => {
    setShowAddSkill(false);
    setNewSkill({ name: "", category: "", level: "beginner" });
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader
        isEditing={isEditing}
        isLoading={isLoadingUsers}
        displayName={session?.displayName || undefined}
        avatar={userPrefs?.avatar || currentUserProfile?.avatar}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onEdit={() => setIsEditing(true)}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoadingUsers && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <div className="relative">
                      <Input
                        value={isEditing ? formData.displayName : (currentUserProfile?.displayName || session?.displayName || "")}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Enter your name"
                        className="bg-background border-border text-foreground"
                        disabled={!isEditing}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>

                  {/* Location Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <div className="relative">
                      <Input
                        value={isEditing ? formData.location : (currentUserProfile?.location || "")}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter your location"
                        className="bg-background border-border text-foreground"
                        disabled={!isEditing}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>

                  {/* Bio Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <div className="relative">
                      <Input
                        value={isEditing ? formData.bio : (currentUserProfile?.bio || "")}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself"
                        className="bg-background border-border text-foreground"
                        disabled={!isEditing}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SkillsSection
                      title="Skills Offered"
                      skills={userSkills.offered}
                      type="offered"
                      isLoading={isLoadingSkills}
                      onAddSkill={(type) => {
                        setSkillType(type);
                        setShowAddSkill(true);
                      }}
                      onRemoveSkill={handleRemoveSkill}
                      getLevelColor={getLevelColor}
                    />

                    <SkillsSection
                      title="Skills Wanted"
                      skills={userSkills.wanted}
                      type="wanted"
                      isLoading={isLoadingSkills}
                      onAddSkill={(type) => {
                        setSkillType(type);
                        setShowAddSkill(true);
                      }}
                      onRemoveSkill={handleRemoveSkill}
                      getLevelColor={getLevelColor}
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability</label>
                    <div className="relative">
                      <Select defaultValue="weekends" disabled={!isEditing}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekends">Weekends</SelectItem>
                          <SelectItem value="weekdays">Weekdays</SelectItem>
                          <SelectItem value="evenings">Evenings</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>

                  {/* Profile Visibility */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                    <div className="relative">
                      <Select defaultValue="public" disabled={!isEditing}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Select profile visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <ProfileSidebar
            displayName={session?.displayName || undefined}
            avatar={userPrefs?.avatar || currentUserProfile?.avatar}
            totalSwaps={currentUserProfile?.totalSwaps}
            skillsCount={userSkills.offered.length}
            rating={currentUserProfile?.rating}
            reviewCount={currentUserProfile?.reviewCount}
            createdAt={currentUserProfile?.createdAt}
            location={currentUserProfile?.location}
          />
        </div>

        <AddSkillDialog
          open={showAddSkill}
          skillType={skillType}
          newSkill={newSkill}
          onOpenChange={setShowAddSkill}
          onSkillChange={handleSkillChange}
          onAddSkill={handleAddSkill}
          onCancel={handleCancelAddSkill}
        />
      </div>
    </div>
  );
}
