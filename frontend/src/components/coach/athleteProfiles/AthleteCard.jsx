'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const AthleteCard = ({ athlete }) => {
  return (
    <Link href={athlete.id ? `/dashboard/coach/athlete_profiles/${athlete.id}` : "#"} className="block group">

      <div
        className="glass-card bg-black/20 border-white/20 overflow-hidden p-5 rounded-xl border cursor-pointer
          hover:shadow-[0_10px_30px_-10px_rgba(155,135,245,0.2)] transition-shadow duration-300"

      >
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-apts-purple to-apts-purple/60 mr-3 overflow-hidden">
              <img
                src={
                  athlete.photoURL ||
                  'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
                }
                alt={athlete.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3';
                }}
              />
            </div>

            <div>
              <h3 className="text-apts-white font-semibold text-lg">{athlete.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-apts-white/70">{athlete.sport}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-apts-purple/20 text-apts-purple">
                  {athlete.experienceLevel ?? "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-apts-white/70">
                Age: <span className="text-sm font-medium text-apts-white mx-1">{athlete.age ?? "N/A"}</span>
              </span>
            </div>

            <div className="flex justify-between mt-4">
              <span className="text-sm text-apts-white/70">
                Location:{" "}
                <span className="text-sm text-apts-white mx-1">{athlete.location ?? "Unknown"}</span>
              </span>
            </div>
          </div>

          <button className="w-full bg-apts-purple-dark text-lavender-100 rounded-xl apts-button mt-5">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default AthleteCard;