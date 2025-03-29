'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { signInWithGoogle } from '@/firebase/auth';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

const CTASection = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleGetStarted = async () => {
    if (user?.isAuthenticated) {
      // If already logged in, redirect to dashboard based on role
      router.push(user?.role ? `/dashboard/${user.role}` : '/onboardingForm');
    } else {
      // Trigger Google Sign-In
      const { user, isNewUser } = await signInWithGoogle(dispatch);
      if (user) {
        router.push(isNewUser || !user.role ? '/onboardingForm' : `/dashboard/${user.role}`);
      }
    }
  };

  return (
    <section id="get-started" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-[20%] left-[10%] w-[70%] h-[70%] rounded-full bg-lavender-600/5 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="glass rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 md:p-12 relative">
              {/* Gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lavender-400 via-lavender-600 to-lavender-400"></div>

              <div className="md:flex items-center justify-between gap-12">
                <div className="mb-8 md:mb-0">
                  <h2 className="text-3xl md:text-3xl font-bold mb-4 text-white font-sprintura">
                    Ready to <span className="text-gradient pr-1">Transform</span> Athlete Management?
                  </h2>
                  <p className="text-white/70 text-lg">
                    Join leading athletes, coaches, and sports organizations across India who are
                    revolutionizing how they manage and elevate performance.
                  </p>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-lavender-600 px-6 text-base font-medium text-white transition-all hover:bg-lavender-700 hover-lift"
                  >
                    Get Started
                    <ArrowRight size={18} className="ml-2" />
                  </button>

                  <a
                    href="#contact"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 px-6 text-base font-medium text-white transition-all hover:bg-white/10 hover-lift"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
