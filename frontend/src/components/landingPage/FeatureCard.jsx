'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass p-6 md:p-8 rounded-xl border border-white/10 hover:border-lavender-500/20 transition-all duration-300 hover-lift"
    >
      <div className="w-12 h-12 rounded-full bg-lavender-500/10 flex items-center justify-center mb-6">
        <Icon className="h-6 w-6 text-lavender-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/70">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
