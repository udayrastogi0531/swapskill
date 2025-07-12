"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Home, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  isLoading: boolean;
  displayName?: string;
  avatar?: string;
  onSave: () => void;
  onDiscard: () => void;
  onEdit: () => void;
}

export function ProfileHeader({
  isEditing,
  isLoading,
  displayName,
  avatar,
  onSave,
  onDiscard,
  onEdit
}: ProfileHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {isEditing ? (
                <>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={onSave}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onDiscard}
                  >
                    Discard
                  </Button>
                </>
              ) : (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            <nav className="flex gap-6">
              <Button variant="ghost" className="text-green-600 border-b-2 border-green-600">
                Profile
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                <a href="/dashboard">
                  Dashboard
                </a>
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </a>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={displayName || 'User'} />
              <AvatarFallback className="bg-green-100 text-green-700">
                {(displayName || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
