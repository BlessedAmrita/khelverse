'use client';
import React from 'react';
import { ArrowRight, Clock, Check, DollarSign } from 'lucide-react';

const Sponsorships = () => {
  const sponsorships = [
    {
      id: 1,
      sponsor: 'Khelo India Athlete Fund',
      amount: '₹20,00,000',
      field: 'Track & Field, Endurance Sports',
      deadline: '30 days remaining',
      eligibility: ['National & State-level Athletes', 'Recognized by SAI', 'Training plan required'],
    },
    {
      id: 2,
      sponsor: 'Reliance Youth Sports Grant',
      amount: '₹12,00,000',
      field: 'Sports Science, Performance Analytics',
      deadline: '45 days remaining',
      eligibility: ['U-21 Athletes', 'Competitive sports background', 'Performance improvement plan'],
    },
    {
      id: 3,
      sponsor: 'JSW Sports Excellence Scholarship',
      amount: '₹8,00,000',
      field: 'Olympic & Paralympic Sports',
      deadline: '20 days remaining',
      eligibility: ['Athletes across all levels', 'Proven potential', 'Coach recommendation required'],
    },
];


  return (
    <div className="animate-slide-in-up animation-delay-400">
      <div className="mb-6">
        <h2 className="section-heading">Sponsorships</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {sponsorships.map((sponsorship) => (
          <div 
            key={sponsorship.id} 
            className="rounded-2xl overflow-hidden border border-border bg-white shadow-subtle animate-scale-in card-hover"
            style={{ animationDelay: `${sponsorship.id * 100}ms` }}
          >
            <div className="p-5 border-b border-border bg-muted/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{sponsorship.sponsor}</h3>
                  <p className="text-sm text-muted-foreground">{sponsorship.field}</p>
                </div>
                <div className="flex items-center text-amber-500 font-medium">
                  <span>{sponsorship.amount}</span>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Eligibility</h4>
                <ul className="space-y-1.5">
                  {sponsorship.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{sponsorship.deadline}</span>
                </div>
                
                <button className="text-sm text-purple hover:text-green-900 font-medium text-primary flex items-center hover:text-primary/80 transition-colors">
                  <span>Apply</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsorships;
