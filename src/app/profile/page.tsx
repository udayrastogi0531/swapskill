"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_SKILL_CATEGORIES } from "@/types";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  Plus, 
  Edit, 
  Trash2,
  MessageSquare,
  Settings,
  Share
} from "lucide-react";

// Mock user data
const mockUser = {
  id: "current-user",
  name: "Alex Thompson",
  email: "alex.thompson@email.com",
  avatar: "",
  location: "San Francisco, CA",
  bio: "Passionate full-stack developer and guitar enthusiast. Love sharing knowledge and learning new skills!",
  rating: 4.8,
  reviewCount: 47,
  totalSwaps: 23,
  joinDate: "March 2024",
  skillsOffered: [
    { id: "1", name: "React.js", level: "Expert", category: "Programming", students: 12 },
    { id: "2", name: "Node.js", level: "Advanced", category: "Programming", students: 8 },
    { id: "3", name: "Guitar", level: "Intermediate", category: "Music", students: 5 },
  ],
  skillsWanted: [
    { id: "1", name: "Spanish", level: "Beginner", category: "Languages" },
    { id: "2", name: "Photography", level: "Intermediate", category: "Design" },
  ],
  achievements: [
    { icon: "🏆", title: "Top Teacher", description: "Taught 50+ students" },
    { icon: "⭐", title: "5-Star Mentor", description: "Maintained 4.8+ rating" },
    { icon: "🎯", title: "Quick Responder", description: "Responds within 2 hours" },
  ],
  recentReviews: [
    {
      id: "1",
      reviewer: "Sarah Johnson",
      rating: 5,
      comment: "Alex is an amazing React teacher! Very patient and explains concepts clearly.",
      skill: "React.js",
      date: "2 days ago"
    },
    {
      id: "2", 
      reviewer: "Mike Chen",
      rating: 5,
      comment: "Great guitar lessons! Alex helped me learn my first song.",
      skill: "Guitar",
      date: "1 week ago"
    }
  ]
};

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [skillType, setSkillType] = useState<'offered' | 'wanted'>('offered');

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
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="mb-4">
                  <Edit className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {user.joinDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{user.rating}</span>
                        <span className="text-muted-foreground">({user.reviewCount} reviews)</span>
                      </div>
                      <Badge variant="secondary">
                        {user.totalSwaps} swaps completed
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {user.bio}
                </p>

                {/* Achievements */}
                <div>
                  <h3 className="font-semibold mb-3">Achievements</h3>
                  <div className="flex gap-4">
                    {user.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <span className="text-lg">{achievement.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{achievement.title}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills I Offer */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-600 dark:text-green-400">
                    🎯 Skills I Can Teach
                  </CardTitle>
                  <Dialog open={showAddSkill && skillType === 'offered'} onOpenChange={(open) => {
                    setShowAddSkill(open);
                    if (open) setSkillType('offered');
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a New Skill</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input placeholder="Skill name (e.g., React.js)" />
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_SKILL_CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Your skill level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button className="flex-1">Add Skill</Button>
                          <Button variant="outline" onClick={() => setShowAddSkill(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.skillsOffered.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold">{skill.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getLevelColor(skill.level)} variant="secondary">
                              {skill.level}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {skill.students} students taught
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills I Want */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    📚 Skills I Want to Learn
                  </CardTitle>
                  <Dialog open={showAddSkill && skillType === 'wanted'} onOpenChange={(open) => {
                    setShowAddSkill(open);
                    if (open) setSkillType('wanted');
                  }}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a Skill You Want to Learn</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input placeholder="Skill name (e.g., Spanish)" />
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_SKILL_CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Desired level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button className="flex-1">Add Skill</Button>
                          <Button variant="outline" onClick={() => setShowAddSkill(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.skillsWanted.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-semibold">{skill.name}</h4>
                          <Badge variant="outline" className="mt-1">
                            Want to reach: {skill.level}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{user.totalSwaps}</div>
                    <div className="text-sm text-muted-foreground">Swaps</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{user.skillsOffered.length}</div>
                    <div className="text-sm text-muted-foreground">Skills</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{user.rating}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {review.skill}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "{review.comment}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>- {review.reviewer}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
