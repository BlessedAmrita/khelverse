'use client';
import React, {useState, useEffect} from "react";
import { Athlete } from "@/content/exerciseData";
import ProfileHero from "./ProfileHero";
import StatCard from "./StatCard";
import AchievementTimeline from "./AchievementTimeline";
import ExerciseHeatmap from "./ExerciseHeatmap";
import StreakCounter from "./StreakCounter";



function ProfileMain({ athlete }) {

   //loader
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
     const timer = setTimeout(() => setIsLoading(false), 800);
     return () => clearTimeout(timer);
   }, []);
   if (isLoading) {
     return (
       <div className="min-h-screen w-full flex items-center justify-center bg-apts-black">
         <div className="text-center">
           <div className="w-16 h-16 border-t-4 border-apts-purple rounded-full animate-spin mx-auto"></div>
           <p className="mt-4 text-apts-white text-lg font-sprintura">TRACK. TRAIN. TRIUMPH</p>
         </div>
       </div>
     );
   }

  return (
    <div className="min-h-screen w-full bg-black text-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <ProfileHero athlete={athlete} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <StatCard 
            title="Age" 
            value={athlete.age.toString()} 
            icon="user" 
            delay={1} 
          />
          <StatCard 
            title="Height" 
            value={athlete.height} 
            icon="arrow-up" 
            delay={2} 
          />
          <StatCard 
            title="Weight" 
            value={athlete.weight} 
            icon="activity" 
            delay={3} 
          />
        </div>

        <div className="mt-10 ">
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