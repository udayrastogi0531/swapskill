"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  title: string;
  skills: Skill[];
  type: 'offered' | 'wanted';
  isLoading: boolean;
  onAddSkill: (type: 'offered' | 'wanted') => void;
  onRemoveSkill: (skillId: string, type: 'offered' | 'wanted') => void;
  getLevelColor: (level: string) => string;
}

export function SkillsSection({
  title,
  skills,
  type,
  isLoading,
  onAddSkill,
  onRemoveSkill,
  getLevelColor
}: SkillsSectionProps) {
  const colorClass = type === 'offered' 
    ? 'bg-green-600 hover:bg-green-700 border-green-200 bg-green-50/50 bg-green-100 text-green-800'
    : 'bg-blue-600 hover:bg-blue-700 border-blue-200 bg-blue-50/50 bg-blue-100 text-blue-800';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button
          size="sm"
          onClick={() => onAddSkill(type)}
          className={type === 'offered' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          skills.map((skill) => (
            <div
              key={skill.id}
              className={`flex items-center gap-2 p-2 border rounded-md ${
                type === 'offered' 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'border-blue-200 bg-blue-50/50'
              }`}
            >
              <Badge className={
                type === 'offered' 
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }>
                {skill.name}
              </Badge>
              <Badge className={getLevelColor(skill.level)} variant="secondary">
                {skill.level}
              </Badge>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 ml-auto"
                onClick={() => onRemoveSkill(skill.id, type)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
