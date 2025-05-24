"use client";
import FeatureHero from '@/components/shared/FeatureHero'
import React from 'react'
import Athletes from './Athletes'
import CoachRequests from '../CoachRequests'

function AthleteProfilesMain() {
  return (
    <div>
      
        <FeatureHero title={'Athlete Profiles'} />
        <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
      <div className="min-h-screen bg-black/55">
        <Athletes />
        <CoachRequests/>
        </div>
        </div>
    </div>
  )
}

export default AthleteProfilesMain