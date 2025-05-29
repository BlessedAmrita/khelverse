'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { db } from '@/firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const UpcomingSessionsCard = () => {
  const user = useSelector((state) => state.user);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchSessions = async () => {
      try {
        console.log('Fetching upcoming sessions for user:', user.uid);

        const q = query(collection(db, 'users', user.uid, 'sessions'), orderBy('startDateTime'));
        const snapshot = await getDocs(q);
        const now = new Date();

        const upcoming = snapshot.docs
          .map(doc => {
            const session = doc.data();
            console.log('Fetched session:', session);
            return session;
          })
          .filter(session => new Date(session.startDateTime) >= now)
          .slice(0, 4);

        console.log('Filtered upcoming sessions:', upcoming);
        setSessions(upcoming);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    fetchSessions();
  }, [user?.uid]);

  return (
    <motion.div className="bg-black/40 border-none p-5 h-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-apts-white font-sprintura">Upcoming Sessions</h2>
        <button className="text-apts-purple-light hover:text-apts-purple/80 flex items-center text-sm">
          <Calendar size={16} className="mr-1" />
          <span>View Calendar</span>
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <motion.div
            key={index}
            className={`p-3 rounded-lg border ${dayjs(session.startDateTime).isSame(dayjs(), 'day')
              ? 'border-apts-purple/30 bg-apts-purple/10'
              : 'border-apts-purple/10 bg-apts-dark-purple/50'
              }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            whileHover={{ x: 5 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-apts-white font-medium">{session.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-apts-white/70 mr-3">
                    {dayjs(session.startDateTime).format('hh:mm A')}
                  </span>
                  <span className="text-xs text-apts-white/70 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-apts-purple mr-1"></span>
                    1 athlete
                  </span>
                </div>
              </div>

              {dayjs(session.startDateTime).isSame(dayjs(), 'day') && (
                <span className="px-2 py-1 text-xs rounded bg-apts-purple/20 text-apts-purple">
                  Today
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Button asChild className="w-full apts-button mt-5 bg-apts-purple-dark text-white hover:bg-apts-purple pulse-btn">
        <Link href="/dashboard/coach/sessions/new">
          <Plus className="mr-2 h-4 w-4" /> Schedule New Session
        </Link>
      </Button>
    </motion.div>
  );
};

export default UpcomingSessionsCard;
