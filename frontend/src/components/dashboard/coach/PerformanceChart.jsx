
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 78 },
  { name: 'Wed', value: 82 },
  { name: 'Thu', value: 75 },
  { name: 'Fri', value: 85 },
  { name: 'Sat', value: 92 },
  { name: 'Sun', value: 88 },
];

const CustomTooltip = (props) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-apts-dark-purple/90 border border-apts-purple/20 rounded-md p-2 shadow-md">
        <p className="text-apts-white text-xs font-medium">{`${label} : ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = () => {
  return (
    <motion.div 
      className="glass-card p-5 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-apts-white">Team Performance</h2>
        <select className="bg-apts-dark-purple text-apts-white text-sm border border-apts-purple/20 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-apts-purple/50">
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: -20,
              bottom: 5,
            }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#9b87f5', fontSize: 12 }}
              axisLine={{ stroke: '#9b87f530' }}
              tickLine={false}
            />
            <YAxis hide={true} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#7653B8" 
              radius={[4, 4, 0, 0]} 
              barSize={30} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PerformanceChart;
