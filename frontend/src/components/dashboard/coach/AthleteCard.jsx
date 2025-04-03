'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AthleteCard = ({ athlete, index }) => {
  const getPerformanceColor = (score) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div 
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(155, 135, 245, 0.2)' }}
    >
      <div className="relative p-5">
        <div className="absolute top-3 right-3 flex items-center space-x-1.5">
          <span className="text-xs text-apts-white/70">Score</span>
          <div className={`performance-dot ${getPerformanceColor(athlete.performanceScore)}`}></div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-apts-purple to-apts-purple/60 mr-3 overflow-hidden">
            <img 
              src={athlete.img} 
              alt={athlete.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=' + athlete.name.replace(' ', '+') + '&background=9b87f5&color=fff';
              }}
            />
          </div>
          
          <div>
            <h3 className="text-apts-white font-semibold text-lg">{athlete.name}</h3>
            <div className="flex items-center">
              <span className="text-xs text-apts-white/70 mr-2">{athlete.sport}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-apts-purple/20 text-apts-purple">{athlete.level}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-apts-white/70">Performance</span>
            <span className="text-sm font-medium text-apts-white">{athlete.performanceScore}%</span>
          </div>
          
          <div className="w-full h-1.5 bg-apts-purple/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-apts-purple"
              initial={{ width: 0 }}
              animate={{ width: `${athlete.performanceScore}%` }}
              transition={{ delay: 0.2 * index, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
          </div>
          
          <div className="flex justify-between mt-4">
            <span className="text-sm text-apts-white/70">Next Session</span>
            <span className="text-sm text-apts-white">{athlete.nextSession}</span>
          </div>
        </div>
        
        <button className="w-full bg-purple-dark text-lavender-100 apts-button mt-5">View Details</button>
      </div>
    </motion.div>
  );
};

export default AthleteCard;
