'use client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/firebase/auth';
import { useDispatch } from 'react-redux';

function HeroSection() {
  const words = ['Elevating', 'Redefining', 'Advancing'];
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = async () => {
    const { user, isNewUser } = await signInWithGoogle(dispatch);
    if (user) {
      if (isNewUser) router.push('/onboardingForm');
      else if (user.role) router.push(`/dashboard/${user.role}`);
      else router.push('/onboardingForm');
    }
  };

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
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover brightness-60"
        src="https://res.cloudinary.com/dgj1gzq0l/video/upload/v1742293340/herovideo_kr5ugk.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
        className="relative flex flex-col gap-4 items-center justify-center h-full text-white text-center px-4"
      >
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-3">
            <h1 className="font-samarkan select-none" style={{ fontFamily: 'Samarkan, fantasy' }}>
              <span className="khelverse-gradient khelverse-glow animate-pulse-glow text-6xl md:text-8xl">
                Khelverse
              </span>
            </h1>
          </div>
        </div>

        {/* Smooth Word Scroll Animation */}
        {/* <h2 className="md:text-[48px] text-[35px] font-thuast flex-col sm:flex  items-center justify-center"> */}
        <h2 className="md:text-[48px] text-[35px] font-thuast flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap text-center">

          {/* <div className="inline-block relative h-[60px] overflow-hidden" style={{ width: '390px' }}> */}
          <div className="inline-block relative h-[60px] overflow-hidden w-[290px] sm:w-[390px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center text-gardient px-3"
              >
                {words[index]}
              </motion.div>
            </AnimatePresence>
          </div>{' '}
          <span className="text-gradient">Indian Athletes</span>
        </h2>

        <button
          onClick={handleGetStarted}
          className="relative font-extrabold font-sprintura w-auto text-xl mt-9 px-[30px] py-[10px] rounded-full bg-apts-purple-light text-black hover:bg-black hover:text-apts-purple-light  transition-all duration-500"
        >
          GET STARTED
        </button>
      </motion.div>
    </div>
  );
}

export default HeroSection;
