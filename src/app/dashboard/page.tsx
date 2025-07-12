"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { useFirebaseStore } from "@/store/useFirebaseStore";
import { 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  ArrowRight,
  Home,
  Settings,
  Loader2
} from "lucide-react";
import type { SwapRequest } from "@/types";

export default function Dashboard() {
  const { session } = useAuthStore();
  const {
    swapRequests,
    currentUserProfile,
    isLoadingRequests,
    isLoadingUsers,
    loadSwapRequests,
    loadCurrentUserProfile,
    updateSwapRequestStatus,
    users,
    loadUsers,
    error
  } = useFirebaseStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");

  useEffect(() => {
    if (session?.uid) {
      console.log('Dashboard: Loading data for user:', session.uid);
      loadSwapRequests(session.uid);
      loadCurrentUserProfile(session.uid);
      loadUsers(); // Load users for display names
    }
  }, [session?.uid, loadSwapRequests, loadCurrentUserProfile, loadUsers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleStatusUpdate = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateSwapRequestStatus(requestId, status);
      // Reload requests to get updated data
      if (session?.uid) {
        loadSwapRequests(session.uid);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  // Get user name from users array
  const getUserName = (uid: string) => {
    const user = users.find(u => u.uid === uid);
    return user?.displayName || user?.name || 'Unknown User';
  };

  // Get user avatar from users array
  const getUserAvatar = (uid: string) => {
    const user = users.find(u => u.uid === uid);
    return user?.profilePhoto || user?.avatar || '';
  };

  const filteredRequests = swapRequests.filter(request => {
    // Filter by incoming/outgoing
    const isIncoming = activeTab === "incoming" && request.targetUid === session?.uid;
    const isOutgoing = activeTab === "outgoing" && request.requesterUid === session?.uid;
    
    if (!isIncoming && !isOutgoing) return false;

    // Filter by status
    if (statusFilter !== "all" && request.status !== statusFilter) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.offeredSkill.name.toLowerCase().includes(query) ||
        request.requestedSkill.name.toLowerCase().includes(query) ||
        request.message?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getRequestCounts = () => {
    const incoming = swapRequests.filter(r => r.targetUid === session?.uid);
    const outgoing = swapRequests.filter(r => r.requesterUid === session?.uid);
    const pending = incoming.filter(r => r.status === 'pending').length;
    
    return { incoming: incoming.length, outgoing: outgoing.length, pending };
  };

  const counts = getRequestCounts();

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to view your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-green-600">Skill Swap Platform</h1>
              <nav className="flex gap-6">
                <Button variant="ghost" className="text-green-600 border-b-2 border-green-600">
                  Swap request
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-green-600">
                {session.displayName || 'User'}
              </span>
              <Avatar className="h-10 w-10">
                <AvatarImage src={session.photoURL || ''} alt={session.displayName || 'User'} />
                <AvatarFallback className="bg-green-100 text-green-700">
                  {(session.displayName || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                  <p className="text-3xl font-bold text-yellow-600">{counts.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Incoming Requests</p>
                  <p className="text-3xl font-bold text-blue-600">{counts.incoming}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outgoing Requests</p>
                  <p className="text-3xl font-bold text-green-600">{counts.outgoing}</p>
                </div>
                <ArrowRight className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Swap Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "incoming" | "outgoing")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="incoming">
                  Incoming ({counts.incoming})
                </TabsTrigger>
                <TabsTrigger value="outgoing">
                  Outgoing ({counts.outgoing})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="incoming" className="mt-6">
                <div className="space-y-4">
                  {isLoadingRequests ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <p className="text-muted-foreground">Loading requests...</p>
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No incoming requests found.</p>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <Card key={request.id} className="border border-border">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={getUserAvatar(request.requesterUid)} alt="Profile" />
                              <AvatarFallback className="bg-muted">
                                {getUserName(request.requesterUid).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <h3 className="font-semibold">{getUserName(request.requesterUid)}</h3>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">Skills Offered →</span>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      {request.offeredSkill.name}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-blue-600">Skill wanted →</span>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {request.requestedSkill.name}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                  <Badge className={getStatusColor(request.status)}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </Badge>
                                  
                                  {request.status === 'pending' && activeTab === 'incoming' && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusUpdate(request.id, 'accepted')}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {request.message && (
                                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm text-muted-foreground">{request.message}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="outgoing" className="mt-6">
                <div className="space-y-4">
                  {isLoadingRequests ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading requests...</p>
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No outgoing requests found.</p>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <Card key={request.id} className="border border-border">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={getUserAvatar(request.targetUid)} alt="Profile" />
                              <AvatarFallback className="bg-muted">
                                {getUserName(request.targetUid).slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <h3 className="font-semibold">{getUserName(request.targetUid)}</h3>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">Skills Offered →</span>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      {request.offeredSkill.name}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-blue-600">Skill wanted →</span>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {request.requestedSkill.name}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                  <Badge className={getStatusColor(request.status)}>
                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                  </Badge>
                                  
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {request.message && (
                                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm text-muted-foreground">{request.message}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
