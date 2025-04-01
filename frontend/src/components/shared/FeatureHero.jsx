'use client';
import React from 'react';

function FeatureHero({ title }) {
  return (
    <div className='w-full'>
      <div className='w-full h-[140px] relative flex flex-col justify-between p-4 overflow-hidden bg-purple-darker'>
        <div className='text-lavender-100 text-3xl h-full font-bold font-sprintura tracking-wide w-full text-center flex items-center'>
          <h1 className='mx-auto'>{title}</h1>
        </div>
      </div>
    </div>
  );
}

export default FeatureHero;
