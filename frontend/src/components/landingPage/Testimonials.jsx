'use client';
import React from 'react'
import { motion } from 'framer-motion';

 const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-[20%] right-[30%] w-[40%] h-[40%] rounded-full bg-lavender-600/5 blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-white font-sprintura"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              What People <span className="text-gradient pr-3">Say</span>
            </motion.h2> 
            <motion.p 
              className="text-white/70"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Hear from coaches, athletes, and sports administrators who have transformed their approach.
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Khelverse has revolutionized how we track our athletes' development. The data insights are invaluable for making coaching decisions.",
                name: "Pullela Gopichand",
                role: "Chief National Coach, Badminton"
            },
            {
              quote: "The injury prevention tools helped me identify weaknesses in my technique that I was able to correct before they caused serious problems.",
              name: "Saurabh Chaudhary",
              role: "Olympic Shooter"
            },
            {
              quote: "Managing an entire academy's performance data has never been easier. Khelverse gives us a comprehensive picture of all our athletes.",
              name: "Dr. Rajat Singh",
              role: "Director, Sports Science Institute"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 md:p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="mb-6">
                <svg className="h-8 w-8 text-lavender-500 opacity-50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-white/80 mb-6">{testimonial.quote}</p>
              <div>
                <p className="font-medium text-white">{testimonial.name}</p>
                <p className="text-white/60 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials;