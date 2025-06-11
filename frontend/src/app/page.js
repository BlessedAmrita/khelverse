// 'use client';
import Features from '@/components/landingPage/Features';
import HeroSection from '@/components/landingPage/HeroSection';
import Testimonials from '@/components/landingPage/Testimonials';
import AthleteShowcase from '@/components/landingPage/AthleteShowcase';
import CTASection from '@/components/landingPage/CTASection';
import ContactSection from '@/components/landingPage/ContactSection';

export const metadata = {
  title: 'Khelverse | Athlete Performance Tracking System',
  description: 'Khelverse is a cutting-edge platform that empowers athletes and coaches with personalized training plans, performance analytics, injury assessments, and real-time collaboration tools — all in one place.',
  icons: {
    icon: '/favicon.png',
  },
  keywords: [
    'Khelverse',
    'Athlete Tracking',
    'Performance Analytics',
    'Sports Coaching Platform',
    'Training Plans',
    'Injury Assessment',
    'Google Meet Sessions',
    'Fitness Monitoring',
    'Coach Athlete Platform',
    'Sports Tech India'
  ],
  // viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  viewport: 'width=device-width, initial-scale=1.0',
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
