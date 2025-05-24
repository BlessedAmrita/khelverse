'use client';


import React from 'react';
import { Users, Calendar } from 'lucide-react';

const SummaryCards = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-stretch">

      {/* Total Athletes Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-khelverse-purple/20 to-black flex-1 transform transition-all hover:scale-[1.02]">
  {/* Radial fade overlay */}
  <div
    className="absolute inset-0 z-10 pointer-events-none"
    style={{
      background: 'radial-gradient(circle at center, transparent 50%, black 100%)',
      opacity: 0.65,
      mixBlendMode: 'multiply',
    }}
  ></div>

  {/* Soft glowing accents */}
  <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
  <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>

  {/* Main card content */}
  <div className="p-6 relative z-20 flex flex-col h-full">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-bold text-white font-sprintura">Total Athletes</h3>
      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
        <Users size={20} className="text-khelverse-purple" />
      </div>
    </div>

    <div className="mt-2 flex items-baseline gap-2 justify-center">
      <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-khelverse-purple">24</span>
      <div className="flex flex-col">
        <span className="text-xs text-white/70">athletes</span>
      </div>
    </div>
  </div>
</div>
      
     {/* Sessions Card */}
<div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-khelverse-purple/20 to-black border-none flex-1 transform transition-all hover:scale-[1.02]">
  {/* Radial fade overlay */}
  <div
    className="absolute inset-0 z-10 pointer-events-none"
    style={{
      background: 'radial-gradient(circle at center, transparent 50%, black 100%)',
      opacity: 0.65,
      mixBlendMode: 'multiply',
    }}
  ></div>

  {/* Glowing background circles */}
  <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-khelverse-purple/20 rounded-full blur-2xl"></div>
  <div className="absolute bottom-0 left-0 w-20 h-20 -ml-5 -mb-5 bg-khelverse-purple/20 rounded-full blur-xl"></div>

  {/* Card Content */}
  <div className="p-6 relative z-20 flex flex-col h-full">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-white font-sprintura">Sessions</h3>
      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
        <Calendar size={20} className="text-khelverse-purple" />
      </div>
    </div>

    <div className="mt-auto flex items-baseline justify-center gap-2">
      <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-khelverse-purple">12</span>
      <div className="flex flex-col">
        <span className="text-xs text-white/70">sessions</span>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default SummaryCards;