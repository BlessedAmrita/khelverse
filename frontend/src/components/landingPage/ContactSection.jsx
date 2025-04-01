'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  BarChart, 
  Shield, 
  Zap, 
  LineChart,
  Users,
  Mail
} from 'lucide-react';

 const ContactSection = () => {
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[30%] left-[10%] w-[60%] h-[60%] rounded-full bg-lavender-600/5 blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-sprintura">
                  Let's <span className="text-gradient">Connect</span>
                </h2>
                <p className="text-white/70 mb-8">
                  Interested in learning more about how Khelverse can elevate your athletic journey or sports organization?
                  Reach out to our team of experts.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-lavender-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-lavender-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Email Us</h3>
                      <p className="text-white/60">contact@khelverse.in</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-lavender-500/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-lavender-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">Visit Our Office</h3>
                      <p className="text-white/60">
                        National Institute of Technology, Rourkela<br />
                        Odissa, India
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="glass rounded-xl p-8 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-white/80 text-sm mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-white/80 text-sm mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="organization" className="block text-white/80 text-sm mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        id="organization"
                        className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                        placeholder="Your sports organization"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-white/80 text-sm mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-lavender-500/50"
                        placeholder="Tell us how we can help..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full h-12 inline-flex items-center justify-center rounded-md bg-purple-dark text-lavender-100 px-6 text-base font-medium transition-all hover:bg-lavender-700 hover-lift"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
  )
}
export default ContactSection;
