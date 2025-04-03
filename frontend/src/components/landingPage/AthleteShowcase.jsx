'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Trophy, Medal, Users } from 'lucide-react';

const athletes = [
  {
    id: 1,
    name: "Neeraj Chopra",
    sport: "Javelin Throw",
    achievements: "Olympic Gold Medalist",
    stats: [
      { label: "Olympic Gold", value: "1" },
      { label: "World Ranking", value: "#1" },
      { label: "Personal Best", value: "89.94m" }
    ]
  },
  {
    id: 2,
    name: "PV Sindhu",
    sport: "Badminton",
    achievements: "Olympic Silver & Bronze Medalist",
    stats: [
      { label: "Olympic Medals", value: "2" },
      { label: "World Ranking", value: "#7" },
      { label: "BWF Titles", value: "5" }
    ]
  },
  {
    id: 3,
    name: "Mirabai Chanu",
    sport: "Weightlifting",
    achievements: "Olympic Silver Medalist",
    stats: [
      { label: "Olympic Silver", value: "1" },
      { label: "World Ranking", value: "#3" },
      { label: "CWG Gold", value: "1" }
    ]
  }
];

const AthleteShowcase = () => {
  return (
    <section id="athletes" className="py-20 bg-apts-darker relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[30%] right-[10%] w-[60%] h-[60%] rounded-full bg-lavender-600/5 blur-[120px]"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-white font-sprintura" 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Elite <span className="text-gradient">Athletes</span> Using <span className='font-sprintura'>Khelverse</span>
          </motion.h2>
          <motion.p 
            className="text-white/70"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From Olympic medallists to rising stars, see how APTS is helping Indian athletes reach their full potential.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {athletes.map((athlete, index) => (
            <motion.div
              key={athlete.id}
              className="glass rounded-xl overflow-hidden hover-scale"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-48 bg-gradient-to-br from-lavender-800/20 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-lavender-600/20 flex items-center justify-center">
                    {index === 0 ? (
                      <Trophy className="text-lavender-400" />
                    ) : index === 1 ? (
                      <Medal className="text-lavender-400" />
                    ) : (
                      <Users className="text-lavender-400" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{athlete.name}</h3>
                    <p className="text-white/60 text-sm">{athlete.sport}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-lavender-500/10 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-lavender-400" />
                  </div>
                </div>
                
                <p className="text-white/80 mb-6">{athlete.achievements}</p>
                
                <div className="grid grid-cols-3 gap-2">
                  {athlete.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center p-3 rounded-lg bg-white/5">
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-white/60 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AthleteShowcase;
