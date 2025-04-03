import FeatureHero from '@/components/shared/FeatureHero'
import React from 'react'
import Athletes from './Athletes'

function AthleteProfilesMain() {
  return (
    <div>
        <FeatureHero title={'Athlete Profiles'} />
        <Athletes />
    </div>
  )
}

export default AthleteProfilesMain