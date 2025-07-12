"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_SKILL_CATEGORIES } from "@/types";
import { useFirebaseStore } from "@/store/useFirebaseStore";
import { useAuthStore } from "@/store/useAuthStore";
import { projectInitializer } from "@/lib/initialization";
import { Search, MapPin, Star, Clock, Filter, MessageSquare, Loader2, ArrowLeftRight } from "lucide-react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");

  const { session } = useAuthStore();
  const {
    searchResults,
    isLoadingUsers,
    error,
    searchUsers,
    clearError,
    createSwapRequest,
    createConversation
  } = useFirebaseStore();

  // Load initial users on component mount and initialize project
  useEffect(() => {
    const initializeAndLoadUsers = async () => {
      try {
        // Initialize project with demo data if needed
        await projectInitializer.initializeProject();
        
        // Load users after initialization
        searchUsers();
      } catch (error) {
        console.error('Failed to initialize project:', error);
        // Still try to load users even if initialization fails
        searchUsers();
      }
    };

    initializeAndLoadUsers();
  }, []);

  // Search function
  const handleSearch = () => {
    const query = searchQuery.trim() || undefined;
    const category = selectedCategory === "all" ? undefined : selectedCategory;
    const location = selectedLocation || undefined;
    
    searchUsers(query, category, location);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLocation("");
    searchUsers(); // Load all users
  };

  // Handle swap request
  const handleRequestSwap = async (targetUser: any, userSkill: any, targetSkill: any) => {
    if (!session) {
      alert("Please log in to send swap requests");
      return;
    }

    try {
      await createSwapRequest({
        requesterId: session.uid,
        requesterUid: session.uid,
        targetUid: targetUser.id,
        offeredSkill: userSkill,
        requestedSkill: targetSkill,
        status: "pending",
        message: `Hi! I'd like to swap my ${userSkill.name} skills for your ${targetSkill.name} expertise.`
      });
      
      alert("Swap request sent successfully!");
    } catch (error) {
      console.error("Error sending swap request:", error);
      alert("Failed to send swap request. Please try again.");
    }
  };

  // Handle messaging
  const handleMessage = async (targetUserId: string) => {
    if (!session) {
      alert("Please log in to send messages");
      return;
    }

    try {
      const conversationId = await createConversation([session.uid, targetUserId]);
      // Navigate to messages page
      window.location.href = "/messages";
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to start conversation. Please try again.");
    }
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Skills</h1>
          <p className="text-muted-foreground">
            Discover talented people and find skills to learn or share
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills, people, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {DEFAULT_SKILL_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Input
                placeholder="Location..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClearSearch}
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingUsers && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading users...</span>
          </div>
        )}

        {/* Results */}
        {!isLoadingUsers && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p>Try adjusting your search terms or filters</p>
                </div>
              </div>
            ) : (
              searchResults.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>
                          {user.displayName?.split(' ').map(n => n[0]).join('') || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{user.displayName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{user.location || "Location not set"}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* User Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{user.rating || 0}</span>
                        <span className="text-muted-foreground">
                          ({user.reviewCount || 0} reviews)
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {user.totalSwaps || 0} swaps
                      </div>
                    </div>

                    {/* Skills Offered */}
                    {user.skillsOffered && user.skillsOffered.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-green-700">Skills Offered</h4>
                        <div className="flex flex-wrap gap-1">
                          {user.skillsOffered.slice(0, 3).map((skill, index) => (
                            <Badge key={index} className={getLevelColor(skill.level)}>
                              {skill.name}
                            </Badge>
                          ))}
                          {user.skillsOffered.length > 3 && (
                            <Badge variant="outline">
                              +{user.skillsOffered.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Skills Wanted */}
                    {user.skillsWanted && user.skillsWanted.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-blue-700">Skills Wanted</h4>
                        <div className="flex flex-wrap gap-1">
                          {user.skillsWanted.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="border-blue-200">
                              {skill.name}
                            </Badge>
                          ))}
                          {user.skillsWanted.length > 3 && (
                            <Badge variant="outline">
                              +{user.skillsWanted.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {user.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    {/* Last Active */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Last active: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Recently"}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleMessage(user.id)}
                        disabled={!session}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          // For now, just show an alert. In a real app, this would open a modal
                          // to select specific skills for the swap request
                          if (user.skillsOffered?.[0] && session) {
                            handleRequestSwap(user, user.skillsOffered[0], user.skillsWanted?.[0]);
                          } else {
                            alert("Please log in to send swap requests");
                          }
                        }}
                        disabled={!session || !user.skillsOffered?.length}
                      >
                        <ArrowLeftRight className="h-4 w-4 mr-1" />
                        Swap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Results Count */}
        {!isLoadingUsers && searchResults.length > 0 && (
          <div className="text-center mt-8 text-muted-foreground">
            Showing {searchResults.length} users
          </div>
        )}
      </div>
    </div>
  );
}
