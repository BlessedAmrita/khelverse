'use client';
import React from 'react';

function FeatureHero({ title }) {
  return (
    <div
      className="h-auto bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')",
      }}
    >
      {/* Semi-transparent black overlay */}
      <div className="h-auto bg-black/60">
        <div className="w-full">
          {/* Header with fade effect */}
          <div
            className="w-full h-[140px] relative flex flex-col justify-between p-4 overflow-hidden rounded-b-2xl"
            style={{
              background:
                'linear-gradient(to bottom, rgba(30,18,51,0.9) 0%, rgba(30,18,51,0.7) 60%, rgba(0,0,0,0) 100%)',
            }}
          >
            <div className="text-lavender-100 text-3xl h-full font-bold font-sprintura tracking-wide w-full text-center flex items-center">
              <h1 className="mx-auto">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureHero;