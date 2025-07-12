"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEFAULT_SKILL_CATEGORIES } from "@/types";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export function SkillCategoriesSection() {
  // Sample popular skills for each category
  const popularSkills = {
    programming: ["React", "Python", "JavaScript", "Node.js"],
    design: ["Figma", "Photoshop", "UI/UX", "Illustration"],
    music: ["Guitar", "Piano", "Vocals", "Music Production"],
    languages: ["Spanish", "French", "Mandarin", "Japanese"],
    cooking: ["Italian Cuisine", "Baking", "Vegan Cooking", "BBQ"],
    fitness: ["Yoga", "Personal Training", "CrossFit", "Running"],
    crafts: ["Knitting", "Woodworking", "Pottery", "Jewelry Making"],
    business: ["Marketing", "Sales", "Leadership", "Finance"]
  };

  const skillCounts = {
    programming: 2847,
    design: 1923,
    music: 1456,
    languages: 3201,
    cooking: 892,
    fitness: 1654,
    crafts: 743,
    business: 2109
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            🎯 Skill Categories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore skills across 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {" "}all categories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From coding to cooking, find expertise in any field you're passionate about.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEFAULT_SKILL_CATEGORIES.map((category) => (
            <Card 
              key={category.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Category header */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Available</div>
                      <div className="font-bold text-lg" style={{ color: category.color }}>
                        {skillCounts[category.id as keyof typeof skillCounts]}+
                      </div>
                    </div>
                  </div>

                  {/* Category name */}
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>

                  {/* Popular skills */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Popular skills:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {popularSkills[category.id as keyof typeof popularSkills].map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* View more button */}
                  <div className="pt-2">
                    <Link href={`/explore?category=${category.id}`}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Explore {category.name}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>

              {/* Hover effect overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${category.color}, transparent)` }}
              />
            </Card>
          ))}
        </div>

        {/* Browse all skills CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Browse our complete skill directory or request a new category.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/explore">
                  <Button size="lg">
                    Browse All Skills
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/request-skill">
                  <Button variant="outline" size="lg">
                    Request New Category
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">16K+</div>
            <div className="text-muted-foreground">Total Skills</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">8</div>
            <div className="text-muted-foreground">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <div className="text-muted-foreground">Learning Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
