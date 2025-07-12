"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeftRight, 
  Clock, 
  Check, 
  X, 
  MessageCircle, 
  Star,
  Calendar,
  MapPin,
  ChevronDown,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for swap requests
const swapRequests = [
  {
    id: "1",
    type: "incoming",
    status: "pending",
    user: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      location: "San Francisco, CA",
      rating: 4.8,
      completedSwaps: 15
    },
    userSkill: {
      name: "React Development",
      level: "Expert",
      category: "Programming"
    },
    requestedSkill: {
      name: "UI/UX Design", 
      level: "Intermediate",
      category: "Design"
    },
    message: "Hi! I'd love to learn UI/UX design from you. I have 5+ years of React experience and can help you build interactive components and state management.",
    createdAt: "2024-01-15T10:30:00Z",
    proposedSchedule: "Weekends, 2 hours/week"
  },
  {
    id: "2", 
    type: "outgoing",
    status: "accepted",
    user: {
      id: "user2",
      name: "Marcus Rodriguez",
      avatar: "/avatars/marcus.jpg", 
      location: "Austin, TX",
      rating: 4.9,
      completedSwaps: 22
    },
    userSkill: {
      name: "Digital Marketing",
      level: "Intermediate", 
      category: "Marketing"
    },
    requestedSkill: {
      name: "Python Development",
      level: "Expert",
      category: "Programming"
    },
    message: "Great! I can help you with SEO, social media marketing, and analytics. Looking forward to learning Python from you.",
    createdAt: "2024-01-14T15:45:00Z",
    proposedSchedule: "Weekday evenings"
  },
  {
    id: "3",
    type: "incoming", 
    status: "declined",
    user: {
      id: "user3",
      name: "Emma Thompson",
      avatar: "/avatars/emma.jpg",
      location: "London, UK", 
      rating: 4.6,
      completedSwaps: 8
    },
    userSkill: {
      name: "Photography",
      level: "Advanced",
      category: "Creative"
    },
    requestedSkill: {
      name: "Web Development", 
      level: "Beginner",
      category: "Programming"
    },
    message: "I'm a professional photographer and would love to learn web development basics to create my portfolio website.",
    createdAt: "2024-01-13T09:15:00Z",
    proposedSchedule: "Flexible timing"
  },
  {
    id: "4",
    type: "outgoing",
    status: "pending", 
    user: {
      id: "user4",
      name: "David Kim",
      avatar: "/avatars/david.jpg",
      location: "Seoul, South Korea",
      rating: 4.7,
      completedSwaps: 12
    },
    userSkill: {
      name: "Japanese Language",
      level: "Beginner",
      category: "Languages"  
    },
    requestedSkill: {
      name: "Korean Language",
      level: "Native",
      category: "Languages"
    },
    message: "안녕하세요! I'm learning Japanese and would love to help you practice in exchange for Korean lessons.",
    createdAt: "2024-01-12T14:20:00Z",
    proposedSchedule: "1 hour/week via video call"
  }
];

const getStatusColor = (status: string) => {
  switch(status) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "accepted": return "bg-green-100 text-green-800 border-green-200";
    case "declined": return "bg-red-100 text-red-800 border-red-200"; 
    case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case "pending": return <Clock className="h-3 w-3" />;
    case "accepted": return <Check className="h-3 w-3" />;
    case "declined": return <X className="h-3 w-3" />;
    case "completed": return <Star className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
};

export default function SwapRequestsPage() {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredRequests = swapRequests.filter(request => {
    const statusMatch = filter === "all" || request.status === filter;
    const typeMatch = typeFilter === "all" || request.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleAcceptRequest = (requestId: string) => {
    console.log("Accepting request:", requestId);
    // Handle accept logic
  };

  const handleDeclineRequest = (requestId: string) => {
    console.log("Declining request:", requestId);
    // Handle decline logic
  };

  const handleMessageUser = (userId: string) => {
    console.log("Messaging user:", userId);
    // Navigate to messages
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Swap Requests</h1>
          <p className="text-muted-foreground">
            Manage your skill exchange requests and offers
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Request Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="incoming">Incoming</SelectItem>
              <SelectItem value="outgoing">Outgoing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {swapRequests.filter(r => r.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {swapRequests.filter(r => r.status === "accepted").length}
              </div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {swapRequests.filter(r => r.type === "incoming").length}
              </div>
              <div className="text-sm text-muted-foreground">Incoming</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {swapRequests.filter(r => r.type === "outgoing").length}
              </div>
              <div className="text-sm text-muted-foreground">Outgoing</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ArrowLeftRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                <p className="text-muted-foreground">
                  {filter === "all" && typeFilter === "all" 
                    ? "You don't have any swap requests yet."
                    : "No requests match your current filters."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.user.avatar} alt={request.user.name} />
                        <AvatarFallback>
                          {request.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{request.user.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${request.type === 'incoming' ? 'border-blue-200 text-blue-700' : 'border-purple-200 text-purple-700'}`}
                          >
                            {request.type === 'incoming' ? 'Incoming' : 'Outgoing'}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(request.status)}`}
                          >
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.user.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {request.user.rating}
                          </div>
                          <span>{request.user.completedSwaps} swaps</span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Exchange Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="font-medium">{request.userSkill.name}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {request.userSkill.level}
                          </Badge>
                        </div>
                        <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                        <div className="text-center">
                          <div className="font-medium">{request.requestedSkill.name}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {request.requestedSkill.level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-32">
                      {request.type === 'incoming' && request.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptRequest(request.id)}
                            className="w-full"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineRequest(request.id)}
                            className="w-full"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                      {(request.status === 'accepted' || request.type === 'outgoing') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMessageUser(request.user.id)}
                          className="w-full"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Message & Schedule */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Message:</strong> {request.message}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Proposed schedule: {request.proposedSchedule}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
