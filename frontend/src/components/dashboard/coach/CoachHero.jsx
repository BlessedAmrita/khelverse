'use client';
import React from 'react';
import { useSelector } from 'react-redux';

function CoachHero() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const user = useSelector((state) => state.user);
  console.log('User State in CoachHero:', user);

  const profileImage = user?.photoURL || 'https://via.placeholder.com/60';
  const userName = user?.firstName || 'Coach';

  return (
    <div
      className='h-[100px] bg-gradient-to-br backdrop-blur-lg overflow-hidden mb-[10px] w-full flex items-center justify-between text-lavender  px-[30px] top-0 sticky z-10 '
      style={{
        boxShadow:
          '0 4px 6px rgba(0, 0, 0, 0.486), 0 10px 15px rgba(0, 0, 0, 0.448), 0 15px 30px rgba(0, 0, 0, 0.305)',
      }}
    >
      <h1 className='text-xl font-semibold font-sprintura tracking-widest'>Hey {userName}!</h1>
      <div className='flex gap-[20px] items-center'>
        <p className='text-md font-semibold font-poppins tracking-wider'>{today}</p>
        <img
          src={profileImage}
          alt="Profile"
          className='w-[60px] h-[60px] rounded-full bg-white object-cover'
          onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
        />
      </div>
    </div>
  );
}

export default CoachHero;
