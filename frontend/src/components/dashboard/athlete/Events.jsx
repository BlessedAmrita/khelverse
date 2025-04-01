'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

function Events() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/dashboard/athlete/events');
  };
  return (
    <div
      className='w-[50%] h-full rounded-xl text-wrap text-white flex justify-center items-center text-center overflow-clip bg-cover bg-center bg-no-repeat relative group cursor-pointer'
      style={{
        backgroundImage: `url("https://res.cloudinary.com/dpmlrxlzr/image/upload/v1742211025/pexels-karolina-grabowska-6345328_dgzjgs.jpg")`,
      }}
      onClick={handleClick}
    >
      {/* Gradient Overlay */}
      <div className='absolute w-full h-full inset-0 bg-gradient-to-r from-black/90 to-black/50'></div>
      <div className='relative'>
        <h3 className='font-sprintura text-xl'>Upcoming Events</h3>
      </div>
    </div>
  );
}

export default Events;
