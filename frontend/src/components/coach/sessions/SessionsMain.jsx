'use client';
import FeatureHero from '@/components/shared/FeatureHero'
import React, {useState, useEffect} from 'react'
import Sessions from './Sessions'

function SessionsMain() {
  ///loader
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
    <div className='bg-black'>
        <FeatureHero title={'Sessions'} />
        <div
    className="min-h-screen bg-repeat bg-left-top"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
      <div className="min-h-screen bg-black/55">
        <Sessions/>
        </div>
        </div>
    </div>
  )
} 

export default SessionsMain