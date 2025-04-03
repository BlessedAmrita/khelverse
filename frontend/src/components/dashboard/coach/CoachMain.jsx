'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SummaryCards from '@/components/dashboard/coach/SummaryCards';
import AthleteCard from '@/components/dashboard/coach/AthleteCard';
import PerformanceChart from '@/components/dashboard/coach/PerformanceChart';
import UpcomingSessionsCard from '@/components/dashboard/coach/UpcomingSessionsCard';
import ActivityCard from '@/components/dashboard/coach/ActivityCard';
import CoachHero from './CoachHero';

const athletes = [
  { id: 1, name: 'Vikram Malhotra', sport: 'Sprinter', performanceScore: 92, img: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=150&auto=format&fit=crop', nextSession: 'Today, 3:00 PM', level: 'Elite' },
  { id: 2, name: 'Priya Sharma', sport: 'Marathoner', performanceScore: 88, img: 'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?q=80&w=150&auto=format&fit=crop', nextSession: 'Tomorrow, 7:30 AM', level: 'Pro' },
  { id: 3, name: 'Arjun Mehta', sport: 'Badminton', performanceScore: 78, img: 'https://images.unsplash.com/photo-1595456390898-83be9a31b220?q=80&w=150&auto=format&fit=crop', nextSession: 'Today, 5:00 PM', level: 'Advanced' },
  { id: 4, name: 'Megha Joshi', sport: 'Track & Field', performanceScore: 85, img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=150&auto=format&fit=crop', nextSession: 'Thursday, 4:15 PM', level: 'Elite' },
];

const CoachMain = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
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
    <div className="min-h-screen bg-apts-black">
     <CoachHero />
      {/* <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <Header sidebarExpanded={sidebarExpanded} /> */}
      
      <motion.main 
        className={`pt-2 pb-10 px-6 transition-all duration-300 ease-in-out `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <SummaryCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <motion.h2 
              className="text-xl font-semibold text-apts-white mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Top Athletes
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {athletes.map((athlete, index) => (
                <AthleteCard key={athlete.id} athlete={athlete} index={index} />
              ))}
            </div>
          </div>
          
          <div>
            <motion.h2 
              className="text-xl font-semibold text-apts-white mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Upcoming Sessions
            </motion.h2>
            <UpcomingSessionsCard />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <motion.h2 
              className="text-xl font-semibold text-apts-white mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Performance Trends
            </motion.h2>
            <PerformanceChart />
          </div>
          
          <div className="lg:col-span-2">
            <motion.h2 
              className="text-xl font-semibold text-apts-white mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Recent Activity
            </motion.h2>
            <ActivityCard />
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default CoachMain;
