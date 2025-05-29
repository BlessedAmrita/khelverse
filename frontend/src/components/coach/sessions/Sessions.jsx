"use client";

import React, { useState, useEffect } from "react";
import { Search, Calendar, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionCard from "./SessionCard";

import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/firebase"; // your firebase client app init

const db = getFirestore(app);

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return; // user not logged in
    async function fetchSessions() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "sessions"),
          where("coachId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const now = new Date();
        const fetchedSessions = [];

        querySnapshot.forEach((doc) => {
          const session = { id: doc.id, ...doc.data() };

          // Combine session.date and session.time into a Date object
          const sessionDateTime = new Date(`${session.date}T${session.time}`);

          // Define session duration (e.g. 1 hour)
          const sessionEnd = new Date(sessionDateTime.getTime() + 60 * 60 * 1000);

          let status = "upcoming";
          if (now >= sessionDateTime && now <= sessionEnd) {
            status = "ongoing";
          } else if (now > sessionEnd) {
            status = "completed";
          }

          session.status = status;
          fetchedSessions.push(session);
        });

        setSessions(fetchedSessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
      setLoading(false);
    }

    fetchSessions();
  }, [user]);

  // Filter sessions by search and status tab
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.athlete && session.athlete.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && session.status === activeTab;
  });

  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-1 container py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            {/* <h1 className="text-3xl font-bold text-white">Sessions</h1> */}
            <p className=" text-2xl text-gray-300 font-sprintura">Manage your scheduled and past sessions</p>
          </div>

          {/* Disable create new session button if you want, else keep it */}
          <Button
            asChild
            className="bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn"
          >
            <a href="/dashboard/coach/sessions/new">
              <Plus className="mr-2 h-4 w-4" /> Create New Session
            </a>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions by title or athlete..."
              className="pl-10 bg-black/40 border-white/40 text-white"
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

        <Tabs defaultValue="all" className="mb-8 bg-transparent" onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border border-none text-white">
            <TabsTrigger value="all" className="data-[state=active]:bg-athletePurple data-[state=active]:text-white">All Sessions</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-athletePurple data-[state=active]:text-white">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing" className="data-[state=active]:bg-athletePurple data-[state=active]:text-white">Ongoing</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-athletePurple data-[state=active]:text-white">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <p className="text-center text-gray-400">Loading sessions...</p>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              console.log("Session:", session),
              <SessionCard key={session.id} {...session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No sessions found matching your criteria</p>
            <Button variant="outline" className="mt-2 bg-purple-dark text-white hover:bg-purple-middle hover:text-white border-none" onClick={() => {
              setSearchTerm("");
              setActiveTab("all");
            }}>
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sessions;
