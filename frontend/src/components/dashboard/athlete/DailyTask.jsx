'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

function DailyTask() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/athlete/targets');
  };

  return (
    <div
      className='w-full h-full bg-black rounded-xl px-4 py-7 overflow-clip bg-cover bg-center bg-no-repeat relative group cursor-pointer'
      style={{
        backgroundImage: `url("https://res.cloudinary.com/dpmlrxlzr/image/upload/v1742159052/pexels-mikhail-nilov-6740823_2_thbalk.jpg")`,
      }}
      onClick={handleClick}
    >
      {/* Gradient Overlay */}
      <div className='absolute w-full h-full inset-0 bg-gradient-to-r from-black/50 to-black/40'></div>

      {/* Content */}
      <div className='relative text-center h-full w-full flex justify-center items-center rounded-full bg-black/30'>
        {/* Title Text */}
        <h1 className='text-white text-xl font-bold font-sprintura tracking-wide text-wrap group-hover:translate-x-[-100px] transition-all duration-500'>
          Today's Targets
        </h1>

        {/* Button with Arrow */}
        <div className='h-full flex items-center gap-2 text-white group-hover:translate-x-[100px] opacity-0 group-hover:opacity-100 transition-all duration-500'>
          <span className='text-xl font-semibold font-sprintura'>Go</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='currentColor'
            className='bi bi-arrow-right'
            viewBox='0 0 16 16'
          >
            <path d='M12 8a.5.5 0 0 1-.5.5H4.707l2.646 2.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L4.707 7.5H11.5A.5.5 0 0 1 12 8z' />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default DailyTask;
