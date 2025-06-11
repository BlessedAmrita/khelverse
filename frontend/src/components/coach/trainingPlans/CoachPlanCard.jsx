// components/coach/CoachPlanCard.jsx
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Dna, Target, Clock, Activity, User, Award } from 'lucide-react';
import { format } from 'date-fns';

// Helper component for info rows
const InfoRow = ({ icon, label, value, transform }) => (
    <div className="flex items-center space-x-2 text-apts-text-light">
        {React.cloneElement(icon, { className: 'w-4 h-4 text-apts-lavender-light' })}
        <p>
            <span className="font-bold">{label}:</span>{' '}
            <span className={value ? '' : 'opacity-50'}>{transform ? transform(value) : value || 'N/A'}</span>
        </p>
    </div>
);

const CoachPlanCard = ({ plan, onOpenPlan, onApprove, onReject, showReviewButtons = false }) => {
    const getStatusChipColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-600';
            case 'waiting_for_approval':
                return 'bg-orange-500';
            case 'past_plan':
                return 'bg-gray-500';
            case 'rejected':
                return 'bg-red-600';
            case 'revised':
                return 'bg-blue-600';
            default:
                return 'bg-gray-700 text-muted-foreground'; // Default for unknown status
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Active Plan';
            case 'waiting_for_approval':
                return 'Waiting for Approval';
            case 'past_plan':
                return 'Past Plan';
            case 'rejected':
                return 'Rejected';
            case 'revised':
                return 'Revised';
            default:
                return 'Unknown';
        }
    };

    // Destructure athlete profile directly for easier access
    const { firstName, lastName, sport, experienceLevel } = plan.athlete_profile || {};

    return (
        <Card className="bg-gradient-to-br from-apts-dark to-apts-lightdark border border-apts-lavender/20 text-white shadow-md hover:shadow-apts-lavender/40 transition-all duration-300 rounded-2xl p-3">
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-apts-lavender" />
                            <h3 className="text-lg font-semibold">{plan.focus || 'Training Plan'}</h3>
                        </div>
                        <Badge className={`${getStatusChipColor(plan.status)} text-white text-xs px-2 py-0.5 rounded-full`}>
                            {getStatusText(plan.status)}
                        </Badge>
                    </div>

                    {/* Athlete Name */}
                    {firstName && lastName && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <User className="w-4 h-4 text-apts-lavender-light" />
                            <p className="font-semibold">{firstName} {lastName}</p>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                {/* Athlete Sport and Experience Level */}
                {sport && <InfoRow icon={<Dna />} label="Sport" value={sport} />}
                {experienceLevel && <InfoRow icon={<Award />} label="Level" value={experienceLevel} />}

                {/* Plan Details */}
                <InfoRow icon={<Target />} label="Goal" value={plan.athlete_profile?.goal} />
                <InfoRow icon={<Clock />} label="Type" value={plan.type} transform={(v) => v?.charAt(0).toUpperCase() + v?.slice(1)} />
                <InfoRow icon={<Calendar />} label="Duration" value={plan.time_to_achieve} />
            </CardContent>

            <CardFooter className="pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
                    {plan.createdAt && (
                        <span className="text-xs text-gray-400">
                            Created: {format(new Date(plan.createdAt?.toDate ? plan.createdAt.toDate() : plan.createdAt), 'MMM dd, yyyy')}
                        </span>
                    )}
                    <div className="flex flex-wrap gap-2 justify-end">
                        {showReviewButtons ? (
                            <>
                                {/* This button will open the PlanViewModal for detailed review */}
                                <Button
                                    onClick={() => onOpenPlan(plan)}
                                    className="bg-apts-lavender hover:bg-apts-lavender/90 text-white rounded-md px-4 py-2"
                                >
                                    Review
                                </Button>
                            </>
                        ) : (
                            // For reviewed/past plans, just a view button
                            <Button
                                onClick={() => onOpenPlan(plan)}
                                className="bg-apts-lavender hover:bg-apts-lavender/90 text-white rounded-md px-4 py-2"
                            >
                                View Plan
                            </Button>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default CoachPlanCard;