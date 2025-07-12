"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftRight,
  Check,
  X,
  Clock,
  Star,
  MapPin,
  Search,
  Filter,
  Eye,
  MessageSquare,
  AlertTriangle,
  Shield,
  Users,
  TrendingUp,
  Calendar,
  Ban
} from "lucide-react";

// Mock admin data - in real app this would come from your admin API
const mockAdminRequests = [
  {
    id: "req_001",
    requester: {
      id: "user_001",
      name: "Alice Cooper",
      email: "alice@example.com",
      avatar: "",
      location: "Los Angeles, CA",
      rating: 4.7,
      completedSwaps: 12,
      joinedDate: "2024-01-15",
      isVerified: true
    },
    responder: {
      id: "user_002", 
      name: "Bob Martinez",
      email: "bob@example.com",
      avatar: "",
      location: "Austin, TX",
      rating: 4.9,
      completedSwaps: 23,
      joinedDate: "2023-08-20",
      isVerified: true
    },
    skillOffered: {
      name: "React Development",
      level: "Expert",
      category: "Programming"
    },
    skillRequested: {
      name: "Digital Marketing",
      level: "Intermediate", 
      category: "Marketing"
    },
    status: "pending",
    priority: "high",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
    message: "Hi! I'd love to learn digital marketing strategies. I have 5+ years React experience and can help with modern development patterns.",
    reportedIssues: [],
    adminNotes: ""
  },
  {
    id: "req_002",
    requester: {
      id: "user_003",
      name: "Carol Davis",
      email: "carol@example.com", 
      avatar: "",
      location: "Miami, FL",
      rating: 4.2,
      completedSwaps: 8,
      joinedDate: "2024-02-01",
      isVerified: false
    },
    responder: {
      id: "user_004",
      name: "David Kim",
      email: "david@example.com",
      avatar: "",
      location: "Seattle, WA", 
      rating: 4.8,
      completedSwaps: 15,
      joinedDate: "2023-11-10",
      isVerified: true
    },
    skillOffered: {
      name: "Photography",
      level: "Advanced",
      category: "Creative"
    },
    skillRequested: {
      name: "Web Development",
      level: "Beginner",
      category: "Programming"
    },
    status: "flagged",
    priority: "urgent",
    createdAt: "2024-01-19T14:22:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    message: "Looking to learn web development basics for my photography portfolio website.",
    reportedIssues: ["Inappropriate behavior reported"],
    adminNotes: "User reported unprofessional communication. Needs review."
  },
  {
    id: "req_003",
    requester: {
      id: "user_005",
      name: "Eva Rodriguez",
      email: "eva@example.com",
      avatar: "",
      location: "Chicago, IL",
      rating: 4.6,
      completedSwaps: 19,
      joinedDate: "2023-09-05",
      isVerified: true
    },
    responder: {
      id: "user_006",
      name: "Frank Wilson",
      email: "frank@example.com", 
      avatar: "",
      location: "Denver, CO",
      rating: 4.4,
      completedSwaps: 7,
      joinedDate: "2024-01-08",
      isVerified: true
    },
    skillOffered: {
      name: "Spanish Language",
      level: "Native",
      category: "Languages"
    },
    skillRequested: {
      name: "Guitar Lessons",
      level: "Beginner",
      category: "Music"
    },
    status: "approved",
    priority: "medium",
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-19T11:30:00Z",
    message: "I'm a native Spanish speaker and would love to learn guitar basics in exchange for Spanish lessons.",
    reportedIssues: [],
    adminNotes: "Both users verified. Good match approved."
  },
  {
    id: "req_004",
    requester: {
      id: "user_007",
      name: "Grace Thompson",
      email: "grace@example.com",
      avatar: "",
      location: "Portland, OR",
      rating: 3.9,
      completedSwaps: 4,
      joinedDate: "2024-01-12",
      isVerified: false
    },
    responder: {
      id: "user_008",
      name: "Henry Lee",
      email: "henry@example.com",
      avatar: "",
      location: "San Diego, CA",
      rating: 4.7,
      completedSwaps: 16,
      joinedDate: "2023-07-22",
      isVerified: true
    },
    skillOffered: {
      name: "Yoga Instruction",
      level: "Certified",
      category: "Fitness"
    },
    skillRequested: {
      name: "Data Analysis",
      level: "Intermediate",
      category: "Analytics"
    },
    status: "rejected",
    priority: "low",
    createdAt: "2024-01-17T09:12:00Z",
    updatedAt: "2024-01-18T13:45:00Z",
    message: "Certified yoga instructor looking to transition into data analysis field.",
    reportedIssues: [],
    adminNotes: "Skill level mismatch. Requester needs beginner level first."
  }
];

const getStatusColor = (status: string) => {
  switch(status) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "approved": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
    case "rejected": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
    case "flagged": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400";
    default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case "urgent": return "bg-red-500 text-white";
    case "high": return "bg-orange-500 text-white";
    case "medium": return "bg-blue-500 text-white";
    case "low": return "bg-gray-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case "pending": return <Clock className="h-3 w-3" />;
    case "approved": return <Check className="h-3 w-3" />;
    case "rejected": return <X className="h-3 w-3" />;
    case "flagged": return <AlertTriangle className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState(mockAdminRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === "" || 
      request.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.responder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.skillOffered.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.skillRequested.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Admin actions
  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: "approved", updatedAt: new Date().toISOString(), adminNotes: "Approved by admin" }
        : req
    ));
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: "rejected", updatedAt: new Date().toISOString(), adminNotes: "Rejected by admin" }
        : req
    ));
  };

  const handleFlagRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: "flagged", priority: "urgent", updatedAt: new Date().toISOString() }
        : req
    ));
  };

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
    flagged: requests.filter(r => r.status === "flagged").length,
    urgent: requests.filter(r => r.priority === "urgent").length
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Monitor and manage skill swap requests across the platform
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.flagged}</div>
              <div className="text-sm text-muted-foreground">Flagged</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.urgent}</div>
              <div className="text-sm text-muted-foreground">Urgent</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests, users, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests Table */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                    ? "No requests match your current filters."
                    : "No swap requests to review at this time."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className={`text-xs ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">#{request.id}</span>
                        {request.reportedIssues.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Issues: {request.reportedIssues.length}
                          </Badge>
                        )}
                      </div>

                      {/* Users */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Requester */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.requester.avatar} />
                            <AvatarFallback>
                              {request.requester.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{request.requester.name}</span>
                              {request.requester.isVerified && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.requester.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {request.requester.rating}
                              </span>
                              <span>{request.requester.completedSwaps} swaps</span>
                            </div>
                          </div>
                        </div>

                        {/* Responder */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.responder.avatar} />
                            <AvatarFallback>
                              {request.responder.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{request.responder.name}</span>
                              {request.responder.isVerified && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.responder.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {request.responder.rating}
                              </span>
                              <span>{request.responder.completedSwaps} swaps</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skill Exchange */}
                      <div className="flex items-center justify-center gap-4 p-3 bg-muted/50 rounded-lg mb-4">
                        <div className="text-center">
                          <div className="font-medium text-sm">{request.skillOffered.name}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {request.skillOffered.level}
                          </Badge>
                        </div>
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                        <div className="text-center">
                          <div className="font-medium text-sm">{request.skillRequested.name}</div>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {request.skillRequested.level}
                          </Badge>
                        </div>
                      </div>

                      {/* Message & Notes */}
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Message:</strong> {request.message}
                        </div>
                        {request.adminNotes && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Admin Notes:</strong> {request.adminNotes}
                          </div>
                        )}
                        {request.reportedIssues.length > 0 && (
                          <div className="text-sm text-red-600">
                            <strong>Reported Issues:</strong> {request.reportedIssues.join(", ")}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Updated: {new Date(request.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex flex-col gap-2 min-w-40">
                      {request.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveRequest(request.id)}
                            className="w-full"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectRequest(request.id)}
                            className="w-full"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {request.status !== "flagged" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleFlagRequest(request.id)}
                          className="w-full"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedRequest(request.id)}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
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
