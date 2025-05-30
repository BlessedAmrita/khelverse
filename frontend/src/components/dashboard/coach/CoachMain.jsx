'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SummaryCards from '@/components/dashboard/coach/SummaryCards';
import UpcomingSessionsCard from '@/components/dashboard/coach/UpcomingSessionsCard';
import ActivityCard from '@/components/dashboard/coach/ActivityCard';
import CoachHero from './CoachHero';
import AthletesOverview from '@/components/dashboard/coach/AthletesOverview';
import MessagingOverview from '@/components/dashboard/coach/MessagingOverview';

const CoachMain = () => {
  // const [sidebarExpanded, setSidebarExpanded] = useState(true);
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
    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
    <div className="min-h-screen bg-black/55">
     <CoachHero />
      <motion.main 
        className={`pt-2 pb-10 px-6 transition-all duration-300 ease-in-out `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <SummaryCards />
        </div>
        
       
          <div className="mb-8">
            <AthletesOverview />
          </div>
          
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <div>
            <UpcomingSessionsCard />
          </div>
          <div className="grid grid-cols-1">
            <MessagingOverview />
            <ActivityCard />
          </div>
          </div>
          
      
      </motion.main>
      </div>
    </div>
  );
};

export default CoachMain;