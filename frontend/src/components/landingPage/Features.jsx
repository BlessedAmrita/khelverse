'use client';
import React from 'react'
import FeatureCard from '@/components/landingPage/FeatureCard';
import { 
    Activity, 
    Dumbbell,
    CalendarDays,
    ShieldCheck,
    Salad,
    Coins
  } from 'lucide-react';
import { motion } from 'framer-motion';

 const Features = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-lavender-600/5 blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-white font-sprintura"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Cutting-Edge <span className="text-gradient">Features</span>
            </motion.h2>
            <motion.p 
              className="text-white/70"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
             Unlock Peak Performance with the Power of Innovation Driving Every Step Forward!
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Activity}
              title="Performance Evaluation"
              description="AI-powered targets enhance performance with precise tracking, insights, and real-time analysis of vital metrics and training loads."
              delay={0.1}
            />
                        <FeatureCard 
              icon={Salad}
              title="Diet Plans"
              description="Get personalized meal plans based on your fitness targets and body requirements, ensuring optimal nutrition for peak performance."
              delay={0.2}
            />
            <FeatureCard 
              icon={Dumbbell}
              title="Live Training Sessions"
              description="Experience live training sessions with real-time movement analysis and instant feedback to maintain optimal workout form."
              delay={0.3}
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Injury Management"
              description="Injury analysis evaluates past incidents to assess risks, while personalized recovery plans ensure safer, stronger comebacks."
              delay={0.4}
            />
            <FeatureCard 
              icon={CalendarDays}
              title="Events"
              description="Engage in competitions and celebrate victories with real-time event updates, personalized suggestions, and performance highlights."
              delay={0.5}
            />
            <FeatureCard 
              icon={Coins}
              title="Finance Assistance"
              description="Receive tailored financial guidance for expense management, sponsorships, and exclusive funding, empowering your athletic journey."
              delay={0.6}
            />
          </div>
        </div>
      </section>

  )
}

export default Features;