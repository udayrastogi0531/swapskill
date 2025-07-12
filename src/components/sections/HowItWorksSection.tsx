"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, MessageSquare, Star, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus className="h-8 w-8" />,
      title: "Create Your Profile",
      description: "Sign up and list the skills you want to learn and the skills you can teach.",
      details: [
        "Upload your profile photo",
        "List your skills and experience levels",
        "Set your availability and preferences",
        "Get verified through our skill assessment"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02", 
      icon: <Search className="h-8 w-8" />,
      title: "Find Your Match",
      description: "Browse through profiles and find people with complementary skills.",
      details: [
        "Use advanced filters to find perfect matches",
        "View detailed skill profiles and ratings",
        "Check availability and location preferences",
        "See mutual skill interests"
      ],
      color: "from-purple-500 to-violet-500"
    },
    {
      number: "03",
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Connect & Schedule",
      description: "Send swap requests and coordinate your learning sessions.",
      details: [
        "Send personalized swap requests",
        "Chat with potential partners",
        "Schedule learning sessions",
        "Choose in-person or online meetings"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      icon: <Star className="h-8 w-8" />,
      title: "Learn & Teach",
      description: "Exchange knowledge and build lasting learning relationships.",
      details: [
        "Attend your scheduled sessions",
        "Learn new skills from experts",
        "Share your knowledge with others",
        "Track your progress and improvements"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            📚 How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start swapping skills in 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {" "}4 simple steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes it easy to connect with the right people 
            and start learning immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-border to-transparent" />
                )}
                
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Step number and icon */}
                      <div className="flex flex-col items-center space-y-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                          {step.icon}
                        </div>
                        <Badge variant="outline" className="text-xs font-mono">
                          {step.number}
                        </Badge>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground mb-4">{step.description}</p>
                        </div>
                        
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                </Card>
              </div>
            ))}
          </div>

          {/* Visual demonstration */}
          <div className="relative">
            <div className="space-y-6">
              {/* Demo profile card */}
              <Card className="p-6 transform rotate-1 hover:rotate-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    AL
                  </div>
                  <div>
                    <div className="font-semibold">Alex Johnson</div>
                    <div className="text-sm text-muted-foreground">Web Developer</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Wants to learn:</span>
                    <Badge variant="outline">Spanish</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Can teach:</span>
                    <Badge variant="secondary">React.js</Badge>
                  </div>
                </div>
              </Card>

              {/* Connection arrow */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              </div>

              {/* Demo match card */}
              <Card className="p-6 transform -rotate-1 hover:-rotate-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    MR
                  </div>
                  <div>
                    <div className="font-semibold">Maria Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Language Teacher</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Wants to learn:</span>
                    <Badge variant="outline">Web Development</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Can teach:</span>
                    <Badge variant="secondary">Spanish</Badge>
                  </div>
                </div>
              </Card>

              {/* Call to action */}
              <div className="text-center pt-8">
                <Button size="lg" className="group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
