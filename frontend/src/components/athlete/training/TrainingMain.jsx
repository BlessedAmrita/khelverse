'use client';
import React, {useState, useEffect} from 'react';
import FeatureHero from '../shared/FeatureHero';
import TrainingVideo from './TrainingVideo';

function TrainingMain() {
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
    <div className='w-full'>
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741323594/MacBook_Pro_16__-_1_2_qakdds.svg'
        }
        title={'Live Training Session'}
      />
      <TrainingVideo/>
    </div>
  );
}

export default TrainingMain;
