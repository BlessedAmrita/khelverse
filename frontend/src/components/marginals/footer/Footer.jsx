'use client';
import React from 'react';
import { Twitter, Instagram, Linkedin, Mail, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-apts-darker pt-16 pb-8 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              {/* <div className="w-8 h-8 rounded-md bg-lavender-600 flex items-center justify-center">
                <span className="font-bold text-white">A</span>
              </div> */}
              <h1 
        className={`font-samarkan select-none`}
        style={{ fontFamily: 'Samarkan, fantasy' }} // Adding inline style as fallback
       >
        <div className='flex gap-3 items-center'>
        <img src='https://res.cloudinary.com/dgj1gzq0l/image/upload/v1743663818/Group_2280_1_tyylqw.svg'
                width={50}
              />
        <span className="khelverse-gradient text-4xl">Khelverse </span>
        </div>
       </h1>
            </div>
            <p className="text-white/60 mb-6 font-sprintura">
              TRACK. TRAIN. TRIUMPH.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-lavender-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-lavender-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-lavender-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white/60 hover:text-lavender-400 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Case Studies', 'Reviews'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Team', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Blog', 'Documentation', 'Help Center', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} APTS. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Data Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
