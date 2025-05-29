// 'use client';
import Features from '@/components/landingPage/Features';
import HeroSection from '@/components/landingPage/HeroSection';
import Testimonials from '@/components/landingPage/Testimonials';
import AthleteShowcase from '@/components/landingPage/AthleteShowcase';
import CTASection from '@/components/landingPage/CTASection';
import ContactSection from '@/components/landingPage/ContactSection';

export const metadata = {
  title: 'Khelverse',
  icons: {
    icon: '/favicon.png',
  },
  description: 'An Athlete Performance Tracking System',
};

export default function Home() {
  return (
    <div className='min-h-screen bg-apts-dark '>
      <HeroSection />
      <Features />
      <AthleteShowcase />
      <Testimonials />
      <CTASection />
      <ContactSection />

    </div>
  );
}
