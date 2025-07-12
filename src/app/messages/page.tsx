"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Calendar,
  CheckCheck,
  Check
} from "lucide-react";

// Mock conversations data
const mockConversations = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "",
    lastMessage: "That sounds great! When would you like to start the React lessons?",
    timestamp: "2 min ago",
    unread: 2,
    online: true,
    skill: "React.js"
  },
  {
    id: "2", 
    name: "Marcus Chen",
    avatar: "",
    lastMessage: "I'm free this weekend for guitar practice",
    timestamp: "1 hour ago",
    unread: 0,
    online: false,
    skill: "Guitar"
  },
  {
    id: "3",
    name: "Emma Rodriguez", 
    avatar: "",
    lastMessage: "¡Hola! Ready for our Spanish conversation practice?",
    timestamp: "3 hours ago",
    unread: 1,
    online: true,
    skill: "Spanish"
  }
];

// Mock messages for selected conversation
const mockMessages = [
  {
    id: "1",
    senderId: "sarah",
    content: "Hi Alex! I saw your profile and I'm really interested in learning React. Would you be available for lessons?",
    timestamp: "10:30 AM",
    delivered: true,
    read: true
  },
  {
    id: "2",
    senderId: "me",
    content: "Hi Sarah! I'd be happy to help you learn React. What's your current experience level with JavaScript?",
    timestamp: "10:45 AM", 
    delivered: true,
    read: true
  },
  {
    id: "3",
    senderId: "sarah",
    content: "I have some basic JavaScript knowledge and I've worked with HTML/CSS. I want to learn React to build more interactive web applications.",
    timestamp: "11:00 AM",
    delivered: true,
    read: true
  },
  {
    id: "4",
    senderId: "me", 
    content: "Perfect! That's a great foundation. We can start with React fundamentals - components, props, and state. I usually do 1-hour sessions.",
    timestamp: "11:15 AM",
    delivered: true,
    read: true
  },
  {
    id: "5",
    senderId: "sarah",
    content: "That sounds great! When would you like to start the React lessons?",
    timestamp: "11:30 AM",
    delivered: true,
    read: false
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedConvo = mockConversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">{conversation.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {conversation.skill}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConvo ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConvo.avatar} alt={selectedConvo.name} />
                    <AvatarFallback>
                      {selectedConvo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConvo.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold">{selectedConvo.name}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedConvo.skill}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {selectedConvo.online ? 'Online' : 'Last seen 2 hours ago'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.senderId === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                      msg.senderId === 'me' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {msg.senderId === 'me' && (
                        <div className="flex items-center">
                          {msg.read ? (
                            <CheckCheck className="h-3 w-3 text-blue-500" />
                          ) : msg.delivered ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                  />
                </div>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
