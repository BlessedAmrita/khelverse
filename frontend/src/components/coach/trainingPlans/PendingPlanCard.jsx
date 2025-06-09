'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Trophy, FileText } from 'lucide-react';
import ReviewDialog from './ReviewDialog';

const PendingPlanCard = ({ plan, onReview }) => {
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const handleQuickApprove = () => {
    onReview(plan.id, 'approve', 'Quick approval - plan looks good!');
  };

  const handleQuickReject = () => {
    onReview(plan.id, 'reject', 'Plan needs revision before approval.');
  };

  const getSportColor = (sport) => {
    const colors = {
      'Cricket': 'bg-green-500',
      'Swimming': 'bg-blue-500',
      'Football': 'bg-orange-500',
      'Basketball': 'bg-red-500',
      'Tennis': 'bg-yellow-500'
    };
    return colors[sport] || 'bg-gray-500';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-gray-500',
      'Intermediate': 'bg-blue-500',
      'Advanced': 'bg-purple-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  return (
    <>
      <Card className="bg-transparent backdrop-blur-sm border-khelverse-purple/20 hover:border-khelverse-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-khelverse-purple/20 animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-khelverse-purple" />
              <h3 className="font-semibold text-white text-xl">{plan.athleteName}</h3>
            </div>
            <div className="flex rounded-full space-x-2">
              <Badge className={` text-white text-xs`}>
                {plan.sport}
              </Badge>
              <Badge className="text-xs px-2 py-0.5 rounded-full bg-apts-purple/20 text-apts-purple">
                {plan.level}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-khelverse-purple-light" />
              <h4 className="font-bold text-medium text-white">{plan.planTitle}</h4>
            </div>
            <p className="text-gray-300 text-sm line-clamp-3">{plan.planDescription}</p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Submitted: {new Date(plan.submittedDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex space-x-2 pt-4"> {/* Removed flex-wrap, kept space-x-2 for consistent spacing */}
          <Button
            onClick={handleQuickApprove}
            className="flex-grow bg-green-700 hover:bg-green-600 text-white text-xs px-2 py-1" // Added flex-grow, reduced padding/font-size
          >
            Quick Approve
          </Button>
          <Button
            onClick={() => setShowReviewDialog(true)}
            variant="outline"
            className="flex-grow border-khelverse-purple text-khelverse-purple hover:bg-khelverse-purple hover:text-white text-xs px-2 py-1" // Added flex-grow, reduced padding/font-size
          >
            Review & Edit
          </Button>
          <Button
            onClick={handleQuickReject}
            variant="destructive"
            className="flex-grow bg-red-600 hover:bg-red-500 text-xs px-2 py-1" // Added flex-grow, reduced padding/font-size
          >
            Reject
          </Button>
        </CardFooter>
      </Card>

      <ReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        plan={plan}
        onReview={onReview}
      />
    </>
  );
};

export default PendingPlanCard;