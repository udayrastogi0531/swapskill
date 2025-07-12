"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                🌟 Trusted by 10,000+ skill swappers
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Swap Skills,
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Grow Together
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Connect with people who have the skills you want to learn, 
                and teach what you know best. Build a community of learning 
                and growth.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="group">
                  Start Swapping
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/explore">
                <Button variant="outline" size="lg">
                  Explore Skills
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">4.9/5</div>
                  <div className="text-sm text-muted-foreground">User Rating</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold">50K+</div>
                  <div className="text-sm text-muted-foreground">Skills Swapped</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Demo cards */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample skill cards */}
              <Card className="transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      JS
                    </div>
                    <div>
                      <div className="font-semibold">JavaScript</div>
                      <div className="text-sm text-muted-foreground">Web Development</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Advanced</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transform -rotate-2 hover:-rotate-4 transition-transform duration-300 mt-8">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      UI
                    </div>
                    <div>
                      <div className="font-semibold">UI Design</div>
                      <div className="text-sm text-muted-foreground">Design</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Expert</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transform rotate-1 hover:rotate-3 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      🎸
                    </div>
                    <div>
                      <div className="font-semibold">Guitar</div>
                      <div className="text-sm text-muted-foreground">Music</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Intermediate</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transform -rotate-1 hover:-rotate-2 transition-transform duration-300 mt-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                      🍳
                    </div>
                    <div>
                      <div className="font-semibold">Cooking</div>
                      <div className="text-sm text-muted-foreground">Culinary</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Beginner</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
