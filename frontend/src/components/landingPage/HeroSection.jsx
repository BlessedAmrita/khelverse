'use client';

import { motion } from 'framer-motion';
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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = async () => {
    const { user, isNewUser } = await signInWithGoogle(dispatch);

    if (user) {
      console.log('User Logged In:', user);

      if (isNewUser) {
        router.push('/onboardingForm');
      } else if (user.role) {
        router.push(`/dashboard/${user.role}`);
      } else {
        router.push('/onboardingForm');
      }
    }
  };

  return (
    <div className='relative w-full h-screen overflow-hidden'>
      {/* Video Background from Cloudinary */}
      <video
        className='absolute top-0 left-0 w-full h-full object-cover brightness-60'
        src='https://res.cloudinary.com/dgj1gzq0l/video/upload/v1742293340/herovideo_kr5ugk.mp4'
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay to enhance text visibility */}
      <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-70' />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
        className='relative flex flex-col gap-4 items-center justify-center h-full text-white text-center px-4'
      >
        <h1 className='font-sprintura md:text-[70px] text-[50px] tracking-wider'>APTS</h1>

        {/* Changing Word Effect */}
        <h2 className='md:text-[48px] text-[35px] font-thuast'>
          <span
            className='inline-block text-gradient'
            style={{ width: '370px', textAlign: 'center' }}
          >
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
              className='inline-block'
            >
              {words[index]}
            </motion.span>
          </span>{' '}
          Indian Athletes
        </h2>

        <p className='text-lg'>
          Welcome to the future of athlete management, where technology meets passion.
        </p>
        <span className='text-xl font-bold'>One platform, endless possibilities.</span>

        <button
          onClick={handleGetStarted}
          className='font-bold font-sprintura w-auto mt-9 px-[20px] py-[5px] rounded-2xl bg-lavender text-black shadow-none hover:text-white hover:bg-purple hover:shadow-2xl transition-all'
        >
          GET STARTED
        </button>
      </motion.div>
    </div>
  );
}

export default HeroSection;
