'use client';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import AthleteCard from "./AthleteCard";
import toast from "react-hot-toast";
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';


const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    ? age - 1
    : age;
};

const AthletesOverview = () => {
  const user = useSelector((state) => state.user);
  const [athletes, setAthletes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConnectedAthletes = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "athlete"),
        where("connectedCoachId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const athleteList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAthletes(athleteList);
    } catch (err) {
      console.error("Failed to fetch athletes:", err);
      toast.error("Error fetching athletes");
    }
  };

  useEffect(() => {
    if (user.uid && user.role === "coach") {
      fetchConnectedAthletes();
    }
  }, [user]);

  const filteredAthletes = athletes.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-sprintura">Your Athletes</h2>
        <Link 
          href="/dashboard/coach/athlete_profiles" 
          className="flex items-center gap-1 text-khelverse-purple text-sm font-medium hover:underline hover:text-lavender-300"
        >
          View all
          <ChevronRight size={16} />
        </Link>
      </div>
  
      {filteredAthletes.length === 0 ? (
        <div className="text-center py-12 bg-transparent rounded-lg">
          <p className="text-muted-foreground text-lg">
            No athletes found 
          </p>
        </div>
      ) : (
        // <div className="flex gap-6 pb-2 overflow-x-scroll">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAthletes.slice(0, 3).map((athlete) => (
            <div key={athlete.id} className="">
              <AthleteCard
                key={athlete.id} // ✅ Use athlete ID as key
                athlete={{
                  id: athlete.id, // ✅ Include ID here
                  name: (athlete.firstName && athlete.lastName)
                    ? `${athlete.firstName} ${athlete.lastName}`
                    : athlete.name,
                  sport: athlete.sport,
                  age: calculateAge(athlete.dob),
                  experienceLevel: athlete.experienceLevel,
                  photoURL: athlete.photoURL,
                  location: `${athlete.city ?? ''}, ${athlete.state ?? ''}`, // ✅ Optional
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
    };
    export default AthletesOverview;