"use client";
import React, { useState } from 'react';
import Link from 'next/link';  // Import Link from Next.js instead of react-router-dom
import { Search, Calendar, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionCard from './SessionCard';

// Mock data for sessions
const mockSessions = [
    {
      id: "1",
      title: "Strength & Conditioning Training",
      date: "April 5, 2025",
      time: "7:00 AM - 8:30 AM",
      coach: "Coach Rajesh Sharma",
      athlete: "Arjun Singh",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Mental Resilience & Focus Session",
      date: "April 6, 2025",
      time: "6:00 PM - 7:30 PM",
      coach: "Dr. Meera Iyer",
      athlete: "Neha Chauhan",
      status: "upcoming",
    },
    {
      id: "3",
      title: "Speed & Agility Drills",
      date: "April 3, 2025",
      time: "5:30 AM - 7:00 AM",
      coach: "Coach Vikram Patel",
      athlete: "Rohit Verma",
      status: "ongoing",
    },
    {
      id: "4",
      title: "Post-Injury Recovery & Rehab",
      date: "March 30, 2025",
      time: "10:00 AM - 12:00 PM",
      coach: "Dr. Anjali Verma",
      athlete: "Karan Malhotra",
      status: "completed",
    },
    {
      id: "5",
      title: "Diet & Nutrition Planning for Peak Performance",
      date: "March 28, 2025",
      time: "4:00 PM - 5:30 PM",
      coach: "Coach Sunil Reddy",
      athlete: "Priya Deshmukh",
      status: "completed",
    },
    {
      id: "6",
      title: "Breathing Techniques for Endurance",
      date: "March 25, 2025",
      time: "6:30 AM - 8:00 AM",
      coach: "Coach Neha Kapoor",
      athlete: "Vikrant Mehta",
      status: "completed",
    },
  ];

  

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && session.status === activeTab;
  });

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 container py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sessions</h1>
            <p className="text-gray-400 mt-1">Manage your scheduled and past sessions</p>
          </div>
          
          <Button asChild className="bg-purple-light text-apt-dark hover:bg-lavender pulse-btn">
            <Link href="/dashboard/coach/sessions/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Session
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions by title..."
              className="pl-10 bg-black/40 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 border-white/10">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 border-white/10">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger value="all">All Sessions</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                id={session.id}
                title={session.title}
                date={session.date}
                time={session.time}
                athlete={session.athlete}
                status={session.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No sessions found matching your criteria</p>
            <Button variant="outline" onClick={() => {setSearchTerm(''); setActiveTab('all');}}>
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sessions;
