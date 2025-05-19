"use client";
import FeatureHero from '@/components/shared/FeatureHero'
import React from 'react'
import Athletes from './Athletes'
import CoachRequests from '../CoachRequests'

function AthleteProfilesMain() {
  return (
    <div>
        <FeatureHero title={'Athlete Profiles'} />
        <Athletes />
        <CoachRequests/>
    </div>
  )
}

export default AthleteProfilesMain