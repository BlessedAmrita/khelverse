'use client'; 
import React, {useState, useEffect} from 'react'
import TodaysTarget from './TodaysTarget.jsx'
import FeatureHero from '../../shared/FeatureHero.jsx'
import IncompleteTasks from './IncompleteTask.jsx'

function TodaysTargetsMain() {
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
      <div className='min-h-screen h-auto bg-black'>
      <div className="flex">
        <TodaysTarget/>
        <IncompleteTasks/>
      </div>
     </div>
    </div>
  )
}

export default TodaysTargetsMain