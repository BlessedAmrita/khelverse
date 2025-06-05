'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PendingPlanCard from './PendingPlanCard';
import ReviewedPlanCard from './ReviewedPlanCard';
import FeatureHero from '@/components/shared/FeatureHero';

const TrainingPlans = () => {
  const [pendingPlans, setPendingPlans] = useState([
    {
      id: '1',
      athleteName: 'Rahul Sharma',
      sport: 'Cricket',
      level: 'Intermediate',
      planTitle: 'Batting Technique Improvement',
      planDescription: 'Focus on back foot shots and timing. Practice against pace bowling for 2 hours daily. Include strength training for core and legs.',
      submittedDate: '2024-06-03'
    },
    {
      id: '2',
      athleteName: 'Priya Patel',
      sport: 'Swimming',
      level: 'Advanced',
      planTitle: 'Freestyle Sprint Training',
      planDescription: 'High-intensity interval training for 100m freestyle. Include technique refinement and stroke rate optimization.',
      submittedDate: '2024-06-02'
    },
    {
      id: '3',
      athleteName: 'Arjun Kumar',
      sport: 'Football',
      level: 'Beginner',
      planTitle: 'Basic Ball Control Skills',
      planDescription: 'Daily dribbling practice, passing accuracy drills, and basic shooting techniques. Build confidence with the ball.',
      submittedDate: '2024-06-01'
    }
  ]);

  const [reviewedPlans, setReviewedPlans] = useState([
    {
      id: '4',
      athleteName: 'Sneha Singh',
      sport: 'Basketball',
      level: 'Advanced',
      planTitle: 'Jump Shot Consistency',
      planDescription: 'Daily shooting practice from various positions. Focus on follow-through and arc.',
      submittedDate: '2024-05-30',
      status: 'approved',
      reviewDate: '2024-05-31',
      reviewNotes: 'Excellent plan structure. Added some defensive drills for balance.'
    },
    {
      id: '5',
      athleteName: 'Vikram Roy',
      sport: 'Tennis',
      level: 'Intermediate',
      planTitle: 'Serve Power Enhancement',
      planDescription: 'Focus on increasing serve speed through technique adjustments and strength training.',
      submittedDate: '2024-05-28',
      status: 'rejected',
      reviewDate: '2024-05-29',
      reviewNotes: 'Plan lacks proper warm-up and injury prevention measures. Please revise.'
    }
  ]);

  const handlePlanReview = (planId, action, notes, editedDescription) => {
    const planIndex = pendingPlans.findIndex(plan => plan.id === planId);
    if (planIndex === -1) return;

    const plan = pendingPlans[planIndex];
    const reviewedPlan = {
      ...plan,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewDate: new Date().toISOString().split('T')[0],
      reviewNotes: notes || '',
      planDescription: editedDescription || plan.planDescription
    };

    // Remove from pending
    const newPendingPlans = pendingPlans.filter(p => p.id !== planId);
    setPendingPlans(newPendingPlans);

    // Add to reviewed
    setReviewedPlans(prev => [reviewedPlan, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-khelverse-black via-khelverse-gray to-khelverse-black p-6">
      <div className="max-w-7xl ">
        {/* <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-khelverse-purple to-khelverse-purple-light bg-clip-text text-transparent">
            Training Plans
          </h1>
          <p className="text-gray-300">Review and manage your athletes' training plans</p>
        </div> */}
        <FeatureHero  title={'Training Plans'}/>


        <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
      <div className="min-h-screen bg-black/55">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-khelverse-gray border-none">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-athletePurple data-[state=active]:text-white"
            >
              Pending Review
              <Badge className="ml-2 bg-khelverse-purple-light text-white">
                {pendingPlans.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="reviewed" 
              className="data-[state=active]:bg-athletePurple data-[state=active]:text-white"
            > 
              Reviewed
              <Badge className="ml-2  bg-khelverse-purple-light text-white">
                {reviewedPlans.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-khelverse-gray/50 rounded-xl p-8 border border-khelverse-purple/20">
                  <h3 className="text-xl font-semibold text-white mb-2">No pending plans</h3>
                  <p className="text-gray-400">All training plans have been reviewed!</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingPlans.map((plan) => (
                  <PendingPlanCard
                    key={plan.id}
                    plan={plan}
                    onReview={handlePlanReview}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-6">
            {reviewedPlans.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-khelverse-gray/50 rounded-xl p-8 border border-khelverse-purple/20">
                  <h3 className="text-xl font-semibold text-white mb-2">No reviewed plans</h3>
                  <p className="text-gray-400">Start reviewing pending plans to see them here!</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviewedPlans.map((plan) => (
                  <ReviewedPlanCard
                    key={plan.id}
                    plan={plan}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlans;