'use client';
import React, { useState, useEffect } from 'react';
import AthleteHero from './AthleteHero';
import AthleteBody from './AthleteBody';

function AthleteMain() {
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
    <div className='w-full min-h-screen bg-cover bg-center bg-no-repeat bg-black pb-[30px]'>
      {/* style={{
        backgroundImage: "url('https://res.cloudinary.com/dpmlrxlzr/image/upload/v1742150476/6.0_inp9st.svg')"
      }}> */}
      <AthleteHero />
      <AthleteBody />
    </div>
  );
}

export default AthleteMain;
