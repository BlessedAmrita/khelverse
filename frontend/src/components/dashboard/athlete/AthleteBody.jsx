'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import AthleteCard from './AthleteCard';
import DailyTask from './DailyTask';
import Events from './Events';
import Heatmap from './Heatmap';
import Finance from './Finance';
import { Notification } from './Notification';

function AthleteBody() {
  const router = useRouter();

  const handleClick = (path) => {
    router.push(`athlete/${path}`);
  };

  const cards = [
    {
      bg_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1742152499/jonathan-borba-R0y_bEUjiOM-unsplash_zn4hf0.jpg',
      title: 'Performance Evaluation',
      text: 'Track key metrics and optimize your game.',
      buttonText: 'Track Performance',
      icon_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741331770/Stopwatch_rm9krn.svg',
      onClick: () => handleClick('performance_evaluation'),
    },
    {
      bg_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1742150882/louis-hansel-MlPD-AzZYMg-unsplash_io6m80.jpg',
      title: 'Diet Plan',
      text: 'Smart meal plans for better training & recovery.',
      buttonText: 'View Diet',
      icon_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741347314/salad-icon-1_ijhldo.svg',
      onClick: () => handleClick('diet'),
    },
    {
      bg_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1742152471/pexels-victorfreitas-841130_fgberk.jpg',
      title: 'Live Training Session',
      text: 'AI-driven sessions to refine your skills.',
      buttonText: 'Join Training',
      icon_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741347315/dumbbell-icon_sd1kpc.svg',
      onClick: () => handleClick('training'),
    },
    {
      bg_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1742152745/pexels-olly-3760275_z37zc7.jpg',
      title: 'Injury Management',
      text: 'Recovery insights for a faster comeback.',
      buttonText: 'Check Recovery',
      icon_url:
        'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741347314/stethoscope-icon_rkxaes.svg',
      onClick: () => handleClick('injury'),
    },
  ];

  return (
    <div className='h-auto w-full flex flex-col gap-5 justify-evenly px-[10px]'>
      <div className='w-full h-[200px] flex '>
        <DailyTask />
        {/* <Notification /> */}
      </div>

      <div className='h-auto flex flex-col gap-5'>
        <div className='flex gap-5 flex-wrap justify-evenly'>
          {cards.map((card, index) => (
            <AthleteCard key={index} {...card} />
          ))}
        </div>
      </div>
      <Heatmap />
      <div className='w-full h-[200px] flex gap-[20px]'>
        <Events />
        <Finance />
      </div>
    </div>
  );
}

export default AthleteBody;
