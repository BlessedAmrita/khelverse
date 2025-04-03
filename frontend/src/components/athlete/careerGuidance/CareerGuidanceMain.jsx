'use client';
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import FeatureHero from '../../shared/FeatureHero';
import JobListings from './JobListings';
import Sponsorships from './Sponsorships';

function DietMain() {
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
    <div className='w-full'>
      
      <FeatureHero title={'Career Guidance'} />
      <div className="flex flex-col gap-[30px] px-[40px] py-[30px]">
        {/* Button to navigate to AI Career Advice page */}
        




        <div className="relative glass-dark animate-fade-in rounded-lg  border border-lavender/60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
          <div className='glass rounded-lg py-8 md:py-12 overflow-hidden '> 

        <div className="w-full flex justify-center py-6">
          
          <div className="w-[80%]  p-6 flex flex-col items-center shadow-lg text-white ">

            <span className="bg-white/20 text-sm px-4 py-1 rounded-full mb-3">✨ AI Powered</span>
            <h2 className="text-2xl font-semibold">Get Your AI-Powered Career Recommendations</h2>
            <p className="text-sm mt-2 max-w-lg text-center">
              Discover career paths tailored to your skills and interests with AI-driven insights.
            </p>
            <button
              className="mt-4 px-6 py-2 rounded-lg shadow-md transition button-primary bg-purple-dark hover:bg-black text-lavender-200 hover:text-lavender flex-1 md:flex-none"
              onClick={() => router.push('/dashboard/athlete/careerGuidance/aiCareerAdvice')}
            >
              Explore Now
            </button>
            
          </div>

          </div>
          </div>
        </div>





        <JobListings />
        <Sponsorships />

      </div>
    </div>
  );
}

export default DietMain;
