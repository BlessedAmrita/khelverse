import React from 'react';
import FeatureHero from '../shared/FeatureHero';

function TrainingMain() {
  return (
    <div className='w-full'>
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741323594/MacBook_Pro_16__-_1_2_qakdds.svg'
        }
        title={'Live Training Session'}
      />
    </div>
  );
}

export default TrainingMain;
