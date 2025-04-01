'use client';

import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const sessions = [
  { id: 1, title: 'Morning Sprint Training', time: '07:00 AM', athletes: 8, today: true },
  { id: 2, title: 'Strength & Conditioning', time: '10:30 AM', athletes: 12, today: true },
  { id: 3, title: 'Team Strategy Session', time: '02:00 PM', athletes: 15, today: false },
  { id: 4, title: 'Recovery & Mobility', time: '05:30 PM', athletes: 10, today: false },
];

const UpcomingSessionsCard = () => {
  return (
    <motion.div
      className="glass-card p-5 h-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-apts-white">Upcoming Sessions</h2>
        <button className="text-apts-purple hover:text-apts-purple/80 flex items-center text-sm">
          <Calendar size={16} className="mr-1" />
          <span>View Calendar</span>
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            className={`p-3 rounded-lg border ${session.today
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
                  <span className="text-xs text-apts-white/70 mr-3">{session.time}</span>
                  <span className="text-xs text-apts-white/70 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-apts-purple mr-1"></span>
                    {session.athletes} athletes
                  </span>
                </div>
              </div>

              {session.today && (
                <span className="px-2 py-1 text-xs rounded bg-apts-purple/20 text-apts-purple">
                  Today
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <Button asChild className="w-full apts-button mt-5 bg-purple-light text-apt-dark hover:bg-lavender pulse-btn">
        <Link href="/dashboard/coach/sessions/new">
          <Plus className="mr-2 h-4 w-4" /> Schedule New Session
        </Link>
      </Button>
    </motion.div>
  );
};

export default UpcomingSessionsCard;
