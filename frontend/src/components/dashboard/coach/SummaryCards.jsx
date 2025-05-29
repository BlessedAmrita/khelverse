'use client';

import React, { useEffect, useState } from 'react';
import { Users, Calendar } from 'lucide-react';
import { db } from '@/firebase/firebase';
import { collection, getDoc, doc, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const SummaryCards = () => {
  const user = useSelector((state) => state.user);
  const [athleteCount, setAthleteCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchStats = async () => {
      try {
        console.log('Fetching stats for user:', user.uid);

        // Fetch connected athletes from the coach's document
        const coachDocRef = doc(db, 'users', user.uid);
        const coachDocSnap = await getDoc(coachDocRef);

        if (coachDocSnap.exists()) {
          const coachData = coachDocSnap.data();
          console.log('Coach data:', coachData);
          const athletes = coachData.connectedAthletes || [];
          setAthleteCount(athletes.length);
        } else {
          console.warn('No coach document found');
        }

        // Fetch total number of sessions
        const sessionsSnap = await getDocs(collection(db, 'users', user.uid, 'sessions'));
        console.log('Fetched sessions count:', sessionsSnap.size);
        setSessionCount(sessionsSnap.size);

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, [user?.uid]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
      {/* Total Athletes Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black flex-1 transform transition-all hover:scale-[1.02]">
        <div className="p-6 relative z-20 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white font-sprintura">Total Athletes</h3>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users size={20} className="text-khelverse-purple" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 justify-center">
            <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-khelverse-purple">{athleteCount}</span>
            <span className="text-xs text-white/70">athletes</span>
          </div>
        </div>
      </div>

      {/* Sessions Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-khelverse-purple/20 to-black border-none flex-1 transform transition-all hover:scale-[1.02]">
        <div className="p-6 relative z-20 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white font-sprintura">Sessions</h3>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Calendar size={20} className="text-khelverse-purple" />
            </div>
          </div>
          <div className="mt-auto flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-khelverse-purple">{sessionCount}</span>
            <span className="text-xs text-white/70">sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
