"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_SKILL_CATEGORIES } from "@/types";
import { Search, MapPin, Star, Clock, Filter, MessageSquare } from "lucide-react";

// Mock data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 127,
    skillsOffered: [
      { name: "React.js", level: "Expert", category: "Programming" },
      { name: "TypeScript", level: "Advanced", category: "Programming" },
    ],
    skillsWanted: [
      { name: "UI/UX Design", level: "Beginner", category: "Design" }
    ],
    availability: "Weekends",
    lastActive: "2 hours ago"
  },
  {
    id: "2", 
    name: "Marcus Chen",
    avatar: "",
    location: "New York, NY",
    rating: 4.8,
    reviewCount: 89,
    skillsOffered: [
      { name: "Guitar", level: "Advanced", category: "Music" },
      { name: "Music Theory", level: "Expert", category: "Music" },
    ],
    skillsWanted: [
      { name: "Python", level: "Intermediate", category: "Programming" }
    ],
    availability: "Evenings",
    lastActive: "1 hour ago"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar: "",
    location: "Austin, TX", 
    rating: 4.7,
    reviewCount: 156,
    skillsOffered: [
      { name: "Spanish", level: "Native", category: "Languages" },
      { name: "Photography", level: "Advanced", category: "Design" },
    ],
    skillsWanted: [
      { name: "Web Development", level: "Beginner", category: "Programming" }
    ],
    availability: "Flexible",
    lastActive: "30 minutes ago"
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "",
    location: "Seattle, WA",
    rating: 4.9,
    reviewCount: 203,
    skillsOffered: [
      { name: "Cooking", level: "Expert", category: "Cooking" },
      { name: "Nutrition", level: "Advanced", category: "Cooking" },
    ],
    skillsWanted: [
      { name: "Digital Marketing", level: "Intermediate", category: "Business" }
    ],
    availability: "Weekdays",
    lastActive: "5 minutes ago"
  }
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [skillLevel, setSkillLevel] = useState("all");
  const [location, setLocation] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);

  useEffect(() => {
    let filtered = mockUsers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => 
          skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(user =>
        user.skillsOffered.some(skill => 
          skill.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    // Filter by skill level
    if (skillLevel !== "all") {
      filtered = filtered.filter(user =>
        user.skillsOffered.some(skill => 
          skill.level.toLowerCase() === skillLevel.toLowerCase()
        )
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, selectedCategory, skillLevel, location]);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'native': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Explore 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {" "}Skills
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover talented people ready to share their knowledge and learn from you.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills or people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
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
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Skill Level Filter */}
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced Filters Button */}
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {filteredUsers.length} skill swappers found
            </h2>
            <p className="text-muted-foreground">
              Ready to teach and learn with you
            </p>
          </div>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="recent">Recently Active</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {user.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{user.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({user.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Skills Offered */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">
                    🎯 Can teach:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.map((skill, index) => (
                      <Badge 
                        key={index} 
                        className={getLevelColor(skill.level)}
                        variant="secondary"
                      >
                        {skill.name} • {skill.level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-blue-600 dark:text-blue-400">
                    📚 Wants to learn:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Availability & Status */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{user.availability}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active {user.lastActive}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">
                    Send Swap Request
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      </div>
    </div>
  );
}
