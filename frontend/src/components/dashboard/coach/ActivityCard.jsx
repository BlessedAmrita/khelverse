'use client';

import React from 'react';
import { motion } from 'framer-motion';

const activities = [
  { id: 1, action: 'completed training session', athlete: 'Arjun Mehta', time: '10 min ago', highlight: true },
  { id: 2, action: 'updated nutrition plan', athlete: 'Priya Sharma', time: '25 min ago' },
  { id: 3, action: 'missed recovery session', athlete: 'Vikram Malhotra', time: '1 hour ago', highlight: true },
  { id: 4, action: 'achieved new personal best', athlete: 'Sameer Verma', time: '2 hours ago' },
  { id: 5, action: 'checked in for training', athlete: 'Sameer Verma', time: '3 hours ago' },
];

const ActivityCard = () => {
  return (
    <motion.div 
      className="bg-black/30 border-none p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-apts-white font-sprintura">Recent Activity</h2>
        
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
          >
            <div className="relative mr-3">
              <div className="w-2.5 h-2.5 rounded-full bg-apts-purple"></div>
              {index !== activities.length - 1 && (
                <div className="absolute top-3 left-1 w-0.5 h-full bg-apts-purple/20"></div>
              )}
            </div>
            
            <div className="flex-1 pb-4">
              <div className="flex justify-between">
                <div>
                  <span className={`text-sm ${activity.highlight ? 'text-apts-purple font-medium' : 'text-apts-white'}`}>
                    {activity.athlete}
                  </span>
                  <span className="text-sm text-apts-white/70"> {activity.action}</span>
                </div>
                <span className="text-xs text-apts-white/50">{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full text-apts-purple hover:text-lavender-300 text-sm mt-4 hover:underline">
        View All Activity
      </button>
    </motion.div>
  );
};

export default ActivityCard;