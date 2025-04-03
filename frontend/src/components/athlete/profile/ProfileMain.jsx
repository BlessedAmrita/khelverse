'use client';
import React, { useEffect } from "react";
import ProfileHero from "./ProfileHero";
import StatCard from "./StatCard";
import AchievementTimeline from "./AchievementTimeline";
import ExerciseHeatmap from "./ExerciseHeatmap";
import StreakCounter from "./StreakCounter";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '@/config/slices/userSlice';

function ProfileMain({ athlete }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const uid = user?.uid;

  useEffect(() => {
    if (uid && !user.firstName) {
      dispatch(fetchUserData(uid)).then((res) => {
        console.log("Fetched User Data from Firestore:", res.payload);
      });
    }
  }, [dispatch, uid, user.firstName]);

  console.log('Redux User Data:', user); // Debugging
  const athleteData = user.additionalData; // Accessing data directly from user
  console.log('Athlete Data:', athleteData);

  // Ensure dob is valid before proceeding with age calculation
  const dob = athleteData.dob;
  const calculateAge = (dob) => {
    if (!dob) return 'N/A'; // Handle missing or invalid dob
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return 'N/A'; // If invalid date, return 'N/A'
    
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Ensure height and weight are numbers, if they are strings
  const height = Number(athleteData.height) || 'N/A'; // Default if height is missing or not a number
  const weight = Number(athleteData.weight) || 'N/A'; // Default if weight is missing or not a number
  
  // Calculate age from dob
  const age = calculateAge(dob);

  return (
    <div className="min-h-screen w-full bg-black text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <ProfileHero athlete={athlete} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <StatCard 
            title="Age" 
            value={age.toString()} 
            icon="user" 
            delay={1} 
          />
          <StatCard 
            title="Height" 
            value={height !== 'N/A' ? `${height} cm` : height} 
            icon="arrow-up" 
            delay={2} 
          />
          <StatCard 
            title="Weight" 
            value={weight !== 'N/A' ? `${weight} kg` : weight} 
            icon="activity" 
            delay={3} 
          />
        </div>

        <div className="mt-10">
          <div className="">
            <StreakCounter streak={athlete.streak} />
            <AchievementTimeline achievements={athlete.achievements} />
          </div>
          <div className="lg:col-span-2 mt-5">
            <ExerciseHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileMain;