'use client';
import ProfileMain from '@/components/athlete/profile/ProfileMain';
import { mockAthlete } from "@/content/exerciseData";
import React from 'react';

function page() {
  return (
    <div className="min-h-screen bg-background">
      <ProfileMain athlete={mockAthlete} />
    </div>
  );
}

export default page;