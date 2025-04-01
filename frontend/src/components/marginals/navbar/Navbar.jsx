'use client';
import React from 'react';
import Link from 'next/link';
export default function Navbar() {
  return (
    <nav className='fixed top-0 left-0 w-full bg-black shadow-md z-50'>
      <ul className='flex justify-center space-x-6 p-4'>
        {['hero', 'about', 'mission', 'features', 'testimonials', 'contact'].map((section) => (
          <li key={section}>
            <a href={`#${section}`} className='text-lg text-white hover:text-blue-500'>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
