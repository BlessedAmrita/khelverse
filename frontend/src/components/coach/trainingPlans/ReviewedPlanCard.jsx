'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Trophy, FileText, CheckCircle, XCircle } from 'lucide-react';

const ReviewedPlanCard = ({ plan }) => {
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

  const getStatusIcon = () => {
    return plan.status === 'approved' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusBadge = () => {
    return plan.status === 'approved' ? (
      <Badge className="bg-green-600 text-white">Approved</Badge>
    ) : (
      <Badge className="bg-red-600 text-white">Rejected</Badge>
    );
  };

  return (
    <Card className="bg-khelverse-gray border-khelverse-purple/20 hover:border-khelverse-purple/40 transition-all duration-300 animate-fade-in opacity-75 hover:opacity-100">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
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
            <h3 className="font-semibold text-white text-xl">{plan.athleteName}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
        <div className="flex space-x-2 mt-2">
          <Badge className={` text-white text-xs`}>
            {plan.sport}
          </Badge>
          <Badge className={`text-xs px-2 py-0.5 rounded-full bg-apts-purple/20 text-apts-purple`}>
            {plan.level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-khelverse-purple-light" />
            <h4 className="font-medium text-white">{plan.planTitle}</h4>
          </div>
          <p className="text-gray-300 text-sm line-clamp-2">{plan.planDescription}</p>
        </div>
        
        {plan.reviewNotes && (
          <div className="bg-khelverse-black/50 p-3 rounded-lg border border-khelverse-purple/10">
            <h5 className="text-sm font-medium text-khelverse-purple-light mb-1">Review Notes:</h5>
            <p className="text-gray-300 text-sm">{plan.reviewNotes}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Submitted: {new Date(plan.submittedDate).toLocaleDateString()}</span>
          </div>
          {plan.reviewDate && (
            <span>Reviewed: {new Date(plan.reviewDate).toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewedPlanCard;