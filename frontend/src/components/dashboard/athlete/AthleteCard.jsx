'use client';
import React from 'react';
import { ButtonsCard } from '@/components/ui/ButtonsCard';

function AthleteCard({ bg_url, title, text, buttonText, onClick }) {
  return (
    <div className='backdrop-blur-2xl bg-transparent flex justify-center transition-all hover:scale-105 duration-500 ease-in-out rounded-xl overflow-hidden relative group
      w-full sm:w-[calc(50%-10px)] md:w-[calc(25%-15px)] xl:w-[270px] h-[300px]'>
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${bg_url})` }}
      ></div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-black/50 to-black/80 group-hover:from-black/30 group-hover:to-black/60 transition-all duration-500 ease-in-out'></div>

      {/* Card Content - flex-col ensures items stack vertically */}
      <div className='relative flex flex-col justify-between p-4 w-full h-full'>
        {/* Title */}
        <div className='text-white text-lg sm:text-xl md:text-lg font-semibold font-sprintura tracking-wide text-wrap
            transition-all duration-500 ease-in-out transform
            translate-y-20 group-hover:translate-y-0'>
          {title}
        </div>

        {/* Text */}
        <div className='text-white text-sm sm:text-[15px] md:text-[14px] font-light text-wrap font-poppins w-full pr-2
            transition-all duration-500 ease-in-out transform
            translate-y-[30px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100'>
          {text}
        </div>

        {/* Fixed Button */}
        {/* Changed to w-full for responsiveness and adjusted px-4 for padding */}
        <div className='mx-auto mb-4 w-full px-4'>
          <ButtonsCard
            onClick={onClick}
            // Use w-full for the button and ensure consistent height
            className='h-[50px] w-full py-[3px] px-[3px] flex items-center justify-center'
            buttonText={buttonText}
          />
        </div>
      </div>
    </div>
  );
}

export default AthleteCard;