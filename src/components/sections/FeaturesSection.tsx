"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Clock, 
  Star, 
  MessageCircle, 
  MapPin,
  Zap,
  Award,
  Search
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Find Perfect Matches",
      description: "Our smart matching system connects you with people who have complementary skills.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Verified Profiles",
      description: "All users are verified through our comprehensive skill assessment system.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Flexible Scheduling",
      description: "Learn at your own pace with flexible timing that works for both parties.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Rating System",
      description: "Build trust through our transparent rating and review system.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Built-in Chat",
      description: "Communicate seamlessly with integrated messaging and video calls.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Local & Remote",
      description: "Connect with people nearby or learn remotely from anywhere in the world.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Matching",
      description: "Get matched with potential skill partners in seconds using AI.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Skill Certification",
      description: "Earn certificates and badges as you learn and teach new skills.",
      color: "from-teal-500 to-green-500"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Advanced Search",
      description: "Filter by location, skill level, availability, and more to find exactly what you need.",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            🚀 Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {" "}swap skills
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to learn new skills 
            and share your expertise with others.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
              
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-16">
          <Card className="inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to start your skill swap journey?</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Join thousands of learners and teachers in our growing community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="px-4 py-2">
                  ✅ Free to join
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  🎯 Instant matching
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  🏆 Verified skills
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
