'use client';
import React from 'react';
import { MapPin, Clock, DollarSign, Filter, Bookmark, Briefcase } from 'lucide-react';

// Mock data for jobs
const jobs = [
  {
    id: 1,
    title: 'Sports Physiotherapist',
    company: 'Sports Authority of India (SAI)',
    location: 'New Delhi, India',
    salary: '₹8L - ₹12L per annum',
    type: 'Full-time',
    logo: '🩺',
    posted: '2 days ago',
  },
  {
    id: 2,
    title: 'Strength & Conditioning Coach',
    company: 'Reliance Foundation Sports',
    location: 'Mumbai, India',
    salary: '₹10L - ₹15L per annum',
    type: 'Full-time',
    logo: '🏋️',
    posted: '1 week ago',
  },
  {
    id: 3,
    title: 'Sports Data Analyst',
    company: 'JSW Sports',
    location: 'Bangalore, India',
    salary: '₹9L - ₹14L per annum',
    type: 'Full-time',
    logo: '📊',
    posted: '3 days ago',
  },
];


const JobListings = () => {
  return (
    <div className="animate-slide-in-up animation-delay-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="section-heading text-lavender-300 font-sprintura">Job Listings</h2>
        <button className="button-outline flex items-center space-x-2">
          <Filter className="h-4 w-4 text-white" />
          <span className='text-white'>Filters</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="job-card border-white/20 animate-scale-in bg-apts-dark text-white" style={{ animationDelay: `${job.id * 100}ms` }}>
            <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
              <div className="flex gap-4 items-start md:items-center flex-1">
                <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center text-xl">
                  <span>{job.logo}</span>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg text-lavender-200">{job.title}</h3>
                  <p className="text-gray-300">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-3 mt-2">
                    <div className="flex items-center text-xs text-gray-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>{job.salary}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400">
                      <Briefcase className="h-3 w-3 mr-1" />
                      <span>{job.type}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Posted {job.posted}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <button className="button-primary bg-apts-purple-dark text-white rounded-xl hover:bg-apts-purple  shadow-md flex-1 md:flex-none">
                  Apply Now
                </button>
                
                <button className="button-outline p-0 w-10 flex items-center justify-center">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <button className="button-outline  border-black border-[1px] hover:bg-black text-black hover:text-lavender">
          View More Jobs
        </button>
      </div>
    </div>
  );
};

export default JobListings;
