'use client';
import React from 'react';
import { ButtonsCard } from '@/components/ui/ButtonsCard';

function AthleteCard({ bg_url, title, text, buttonText,onClick }) {
  return (
    <div className='backdrop-blur-2xl bg-transparent flex justify-center transition-all hover:scale-105 duration-500 ease-in-out rounded-xl overflow-clip relative group'>
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${bg_url})` }}
      ></div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-black/50 to-black/80 group-hover:from-black/30 group-hover:to-black/60 transition-all duration-500 ease-in-out'></div>

      {/* Card Content */}
      <div className='xl:w-[270px] w-[300px] h-[180px] lg:h-[300px] rounded-3xl relative flex flex-col justify-between p-4 overflow-hidden'>
        {/* Title */}
        <div className='text-white text-lg font-semibold font-sprintura tracking-wide text-wrap transition-all duration-500 ease-in-out transform translate-y-20 group-hover:translate-y-0'>
          {title}
        </div>

        {/* Text */}
        <div className='text-white text-[14px] font-light text-wrap font-poppins w-[80%] transition-all duration-500 ease-in-out transform translate-y-[30px] opacity-0 group-hover:opacity-100 group-hover:translate-y-0'>
          {text}
        </div>

        {/* Fixed Button */}
        <div className='mx-auto mb-4 w-[300px]'>
          <ButtonsCard
            onClick={onClick}
            className='h-[50px] w-[180px] py-[3px] px-[3px] flex items-center justify-center'
            buttonText={buttonText}
          />
        </div>
      </div>
    </div>
  );
}

export default AthleteCard;
