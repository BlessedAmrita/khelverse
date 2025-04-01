import React from 'react'
import TodaysTarget from './TodaysTarget.jsx'
import FeatureHero from '../../shared/FeatureHero.jsx'
import IncompleteTasks from './IncompleteTask.jsx'

function TodaysTargetsMain() {
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