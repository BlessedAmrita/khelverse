'use client';
import React from 'react';
import FeatureHero from '../../shared/FeatureHero';
import DietPlan from './DietPlan';

function DietMain() {
  return (
    <div className='w-full'>
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741329876/MacBook_Pro_16__-_1_3_rdftkl.svg'
        }
        title={'Diet Plan'}
      />
      <DietPlan/>
    </div>
  );
}

export default DietMain;
