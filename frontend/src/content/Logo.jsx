'use client';
import React from 'react';

const Logo = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-7xl md:text-9xl',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <h1 
        className={`font-samarkan ${sizeClasses[size]} select-none`}
        style={{ fontFamily: 'Samarkan, fantasy' }} // Adding inline style as fallback
      >
        <span className="khelverse-gradient khelverse-glow animate-pulse-glow">Khelverse</span>
      </h1>
    </div>
  );
};

export default Logo;
