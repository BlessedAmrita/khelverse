'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Trophy, Calendar, FileText } from 'lucide-react';

const ReviewDialog = ({ open, onOpenChange, plan, onReview }) => {
  const [editedDescription, setEditedDescription] = useState(plan.planDescription);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleApprove = () => {
    onReview(plan.id, 'approve', reviewNotes, editedDescription);
    onOpenChange(false);
    setReviewNotes('');
    setEditedDescription(plan.planDescription);
  };

  const handleReject = () => {
    onReview(plan.id, 'reject', reviewNotes, editedDescription);
    onOpenChange(false);
    setReviewNotes('');
    setEditedDescription(plan.planDescription);
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
    <Dialog open={open} onOpenChange={onOpenChange} className="bg-black">
      <DialogContent className="max-w-2xl bg-black border-khelverse-purple/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-sprintura">Review Training Plan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Athlete Info */}
          <div className="bg-khelverse-black/50 p-4 rounded-lg border border-khelverse-purple/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-apts-purple to-apts-purple/60 mr-1 overflow-hidden">
                <img
                  src={
                    plan.athletePhotoURL || // Assuming plan has athletePhotoURL
                    'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3' // Default/fallback image
                  }
                  alt={plan.athleteName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'; // Fallback on error
                  }}
                />
              </div>
                <h3 className="font-semibold text-white">{plan.athleteName}</h3>
              </div>
              <div className="flex space-x-2">
                <Badge className={` text-white`}>
                  {plan.sport}
                </Badge>
                <Badge className={`rounded-full bg-apts-purple/20 text-apts-purple`}>
                  {plan.level}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Submitted: {new Date(plan.submittedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{plan.planTitle}</span>
              </div>
            </div>
          </div>

          {/* Editable Plan Description */}
          <div className="space-y-2">
            <Label className="text-white text-md">Training Plan Description</Label>
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="min-h-[120px] bg-khelverse-black/50 border-khelverse-purple/20 text-white placeholder-gray-400 focus:border-khelverse-purple"
              placeholder="Edit the training plan description if needed..."
            />
            <p className="text-xs text-gray-400">
              Edit the plan description if needed.
            </p>
          </div>

          {/* Review Notes */}
          <div className="space-y-2">
            <Label className="text-white text-md">Review Notes</Label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="min-h-[100px] bg-khelverse-black/50 border-khelverse-purple/20 text-white placeholder-gray-400 focus:border-khelverse-purple"
              placeholder="Add notes about your review decision..."
            />
            
          </div>
        </div>

        <DialogFooter className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-100 border-gray-600 text-gray-600 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            variant="destructive"
            className="bg-red-600 hover:bg-red-500"
          >
            Reject Plan
          </Button>
          <Button
            onClick={handleApprove}
            className="bg-green-700 hover:bg-green-600 text-white"
          >
            Approve Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;