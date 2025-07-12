"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_SKILL_CATEGORIES } from "@/types";

interface AddSkillDialogProps {
  open: boolean;
  skillType: 'offered' | 'wanted';
  newSkill: {
    name: string;
    category: string;
    level: string;
  };
  onOpenChange: (open: boolean) => void;
  onSkillChange: (field: string, value: string) => void;
  onAddSkill: () => void;
  onCancel: () => void;
}

export function AddSkillDialog({
  open,
  skillType,
  newSkill,
  onOpenChange,
  onSkillChange,
  onAddSkill,
  onCancel
}: AddSkillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a {skillType === 'offered' ? 'Skill You Can Teach' : 'Skill You Want to Learn'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input 
            placeholder="Skill name (e.g., React.js)" 
            value={newSkill.name}
            onChange={(e) => onSkillChange('name', e.target.value)}
          />
          <Select value={newSkill.category} onValueChange={(value) => onSkillChange('category', value)}>
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
          <Select value={newSkill.level} onValueChange={(value) => onSkillChange('level', value)}>
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
            <Button className="flex-1" onClick={onAddSkill} disabled={!newSkill.name || !newSkill.category}>
              Add Skill
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
