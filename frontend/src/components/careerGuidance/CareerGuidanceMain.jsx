'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import FeatureHero from '../shared/FeatureHero';
import JobListings from './JobListings';
import Sponsorships from './Sponsorships';

function DietMain() {
  const router = useRouter();

  return (
    <div className='w-full'>
      <FeatureHero title={'Career Guidance'} />
      <div className="flex flex-col gap-[30px] px-[40px] py-[30px]">
        {/* Button to navigate to AI Career Advice page */}
        <div className="w-full flex justify-center py-6">
          <div className="w-[80%] bg-gradient-to-r from-purple-500 to-purple-600 text-black rounded-2xl p-6 flex flex-col items-center shadow-lg">
            <span className="bg-white/20 text-sm px-4 py-1 rounded-full mb-3">✨ AI Powered</span>
            <h2 className="text-2xl font-semibold">Get Your AI-Powered Career Recommendations</h2>
            <p className="text-sm mt-2 max-w-lg text-center">
              Discover career paths tailored to your skills and interests with AI-driven insights.
            </p>
            <button
              className="mt-4 px-6 py-2 rounded-lg shadow-md transition button-primary bg-lavender hover:bg-black text-black hover:text-lavender flex-1 md:flex-none"
              onClick={() => router.push('/dashboard/athlete/careerGuidance/aiCareerAdvice')}
            >
              Explore Now
            </button>
          </div>
        </div>
        <JobListings />
        <Sponsorships />
      </div>
    </div>
  );
}

export default DietMain;
