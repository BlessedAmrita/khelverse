import FeatureHero from '@/components/shared/FeatureHero'
import React from 'react'
import Sessions from './Sessions'

function SessionsMain() {
  return (
    <div className='bg-black'>
        <FeatureHero title={'Sessions'} />
        <Sessions/>
    </div>
  )
}

export default SessionsMain