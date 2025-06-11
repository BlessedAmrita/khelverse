'use client';
import React, { useState, useEffect } from 'react'
import TodaysTarget from './TodaysTarget.jsx'
import FeatureHero from '../../shared/FeatureHero.jsx'
import IncompleteTasks from './IncompleteTask.jsx'
import { useRouter } from 'next/navigation.js';
function TodaysTargetsMain() {

  const router = useRouter();
  //loader
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
    <div className='w-full '>
      <FeatureHero
        title={"Today's Targets"}
      />
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
      >
        <div className="min-h-screen bg-black/70">
          <div className="flex flex-col sm:flex-row">
            <TodaysTarget />
            <div className="flex flex-col">

              <div className='glass rounded-lg py-4 md:py-5 overflow-hidden min-w-[40%] max-w-full m-2 '>
                <div className='w-full flex justify-center'>
                  <div className='p-6 flex flex-col items-center shadow-lg text-white '>
                    <span className='bg-white/20 text-sm px-4 py-1 rounded-full'>
                      ✨ AI Powered
                    </span>
                    <h2 className='mt-4 text-medium font-semibold text-center'>
                      Get AI-generated training plans tailored to your needs
                    </h2>
                    <button
                      className='mt-4 px-6 py-2 rounded-lg shadow-md transition button-primary bg-purple-dark hover:bg-black text-lavender-200 hover:text-lavender flex-1 md:flex-none'
                      onClick={() => router.push('/dashboard/athlete/targets/plans')}
                    >
                      Explore Plans
                    </button>
                  </div>
                </div>
              </div>
              <IncompleteTasks />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodaysTargetsMain