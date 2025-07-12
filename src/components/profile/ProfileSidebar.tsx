"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Award, Calendar, MapPin, Star } from "lucide-react";

interface ProfileSidebarProps {
  displayName?: string;
  avatar?: string;
  totalSwaps?: number;
  skillsCount: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: number;
  location?: string;
}

export function ProfileSidebar({
  displayName,
  avatar,
  totalSwaps = 0,
  skillsCount,
  rating = 0,
  reviewCount = 0,
  createdAt,
  location
}: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={avatar} alt={displayName || 'User'} />
              <AvatarFallback className="text-2xl font-bold bg-muted">
                {(displayName || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-background rounded-full p-2 border border-border">
              <span className="text-sm font-medium">Profile Photo</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            Add/Edit/Remove
          </Button>
        </CardContent>
      </Card>

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
              <div className="text-2xl font-bold text-primary">{totalSwaps}</div>
              <div className="text-sm text-muted-foreground">Swaps</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{skillsCount}</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{rating}</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined {createdAt ? new Date(createdAt).toLocaleDateString() : 'Recently'}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{rating}/5 ({reviewCount} reviews)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
