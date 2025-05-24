'use client';

import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const MessagingOverview = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'athlete',
      name: 'Rahul Sharma',
      initials: 'RS',
      text: "Hi Coach! I've completed the training program for this week.",
      time: '10:30 AM',
      status: 'online'
    },
    {
      id: 2,
      sender: 'coach',
      text: "Great job, Rahul! How did you find the new exercises?",
      time: '10:32 AM'
    },
    {
      id: 3,
      sender: 'athlete',
      name: 'Rahul Sharma',
      initials: 'RS',
      text: "They were challenging but very effective. I feel like my core strength has improved.",
      time: '10:35 AM',
      status: 'online'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState({
    name: 'Rahul Sharma',
    initials: 'RS',
    status: 'online'
  });

  // Recent chat list
  const recentChats = [
    {
      id: 1,
      name: 'Rahul Sharma',
      initials: 'RS',
      lastMessage: "Coach, I've completed the training program for this week.",
      time: '10:30 AM',
      status: 'online'
    },
    {
      id: 2,
      name: 'Priya Patel',
      initials: 'PP',
      lastMessage: "I'm not feeling well. Can we reschedule my training?",
      time: 'Yesterday',
      status: ''
    },
    {
      id: 3,
      name: 'Akash Kumar',
      initials: 'AK',
      lastMessage: "Thank you for the feedback on my technique. I'll work on it.",
      time: 'Yesterday',
      status: 'online'
    },
    {
      id: 4,
      name: 'Maya Singh',
      initials: 'MS',
      lastMessage: "When is our next team meeting?",
      time: 'Monday',
      status: ''
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'coach',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Chat component shown in the dialog
  const ChatInterface = () => (
    <div className="flex h-[80vh] max-h-[700px] overflow-hidden rounded-xl">
      {/* Left sidebar with recent conversations */}
      <div className="w-64 border-r border-khelverse-purple/10 flex flex-col bg-gradient-to-b from-black/50 to-black/70 backdrop-blur-md">
        <div className="p-3 border-b border-khelverse-purple/10 bg-black/40">
          <h3 className="flex items-center gap-2 font-medium text-white font-sprintura">
            <MessageSquare size={18} className="text-khelverse-purple" />
            Messages
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {recentChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 p-3 hover:bg-khelverse-purple/5 cursor-pointer transition-all duration-200 border-b border-khelverse-purple/5 ${
                chat.id === 1 ? 'bg-black/20' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10 ring-1 ring-khelverse-purple/20">
                  <AvatarFallback className="bg-gradient-to-br from-khelverse-purple/30 to-khelverse-purple/10 text-khelverse-purple">
                    {chat.initials}
                  </AvatarFallback>
                </Avatar>
                {chat.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-white">{chat.name}</h4>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md">
        {/* Chat header */}
        <div className="border-b border-khelverse-purple/10 p-3 flex items-center justify-between bg-black/20 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-1 ring-khelverse-purple/20">
                <AvatarFallback className="bg-gradient-to-br from-khelverse-purple/30 to-khelverse-purple/10 text-khelverse-purple">
                  {selectedAthlete.initials}
                </AvatarFallback>
              </Avatar>
              {selectedAthlete.status === 'online' && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-black"></span>
              )}
            </div>
            <div>
              <h3 className="font-medium text-sm text-white">{selectedAthlete.name}</h3>
              <span className="text-xs text-emerald-500">{selectedAthlete.status}</span>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'coach' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'athlete' && (
                <Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-khelverse-purple/20">
                  <AvatarFallback className="bg-gradient-to-br from-khelverse-purple/30 to-khelverse-purple/10 text-white">
                    {message.initials}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[70%] p-3 ${
                  message.sender === 'coach'
                    ? 'bg-gradient-to-r from-apts-purple-dark to-black/20 text-white rounded-2xl rounded-br-none'
                    : 'bg-gradient-to-r from-black to-apts-purple-dark text-white rounded-2xl rounded-br-non'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className={`text-xs mt-1 ${
                  message.sender === 'coach' ? 'text-white/70 text-right' : 'text-muted-foreground'
                }`}>
                  {message.time}
                </div>
              </div>

              {message.sender === 'coach' && (
                <Avatar className="h-8 w-8 flex-shrink-0 bg-gradient-to-br from-khelverse-purple to-khelverse-purple-dark">
                  <AvatarFallback className="text-white">C</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-3 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="bg-black/20 border-khelverse-purple/10 focus-within:border-khelverse-purple/40 focus-within:ring-1 focus-within:ring-khelverse-purple/30 rounded-full"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="rounded-full bg-gradient-to-r from-khelverse-purple to-khelverse-purple-dark p-2 text-white hover:opacity-90 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Preview component shown in the dashboard
  const MessagingPreview = () => (
    <div className=" glass-card bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-4 border border-khelverse-purple/10 hover:border-khelverse-purple/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2 font-sprintura text-white">
          <MessageSquare size={20} className="text-khelverse-purple" />
          Messages
        </h3>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-black/30 border-khelverse-purple/20 hover:border-khelverse-purple hover:bg-black/40 hover:text-apts-lavender text-khelverse-purple">
              Open Messenger
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] p-0 border-khelverse-purple/20 bg-transparent">
            <ChatInterface />
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="space-y-3">
        {recentChats.slice(0, 3).map((chat) => (
          <div key={chat.id} className="flex items-start gap-3 p-2 rounded-lg bg-black/20 border border-khelverse-purple/5 hover:border-khelverse-purple/15 transition-all">
            <Avatar className="h-9 w-9 ring-1 ring-khelverse-purple/10">
              <AvatarFallback className="bg-gradient-to-br from-khelverse-purple/30 to-khelverse-purple/10 text-khelverse-purple">
                {chat.initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{chat.name}</h4>
                <span className="text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
            </div>

            {chat.status === 'online' && (
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
            )}
          </div>
        ))}
      </div> */}

      {/* <div className="mt-4 text-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-khelverse-purple hover:text-khelverse-purple-dark">
              View all messages
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] p-0 border-khelverse-purple/20 bg-transparent">
            <ChatInterface />
          </DialogContent>
        </Dialog>
      </div> */}
    </div>
  );

  return <MessagingPreview />;
};

export default MessagingOverview;