import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Dna, Target, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';

export const PlanCard = ({ plan, onOpenPlan, onRestart,onStop, userRole, currentUserData }) => {
    const getStatusChipColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'waiting_for_approval':
                return 'bg-orange-500';
            case 'past_plan':
                return 'bg-gray-500';
            case 'rejected':
                return 'bg-red-500';
            case 'revised':
                return 'bg-blue-500';
            default:
                return 'bg-muted text-muted-foreground';
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

    return (
        <Card className="bg-gradient-to-br from-apts-dark to-apts-lightdark border border-apts-lavender/20 text-white shadow-md hover:shadow-apts-lavender/40 transition-all duration-300 rounded-2xl p-3">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-apts-lavender" />
                        <h3 className="text-lg font-semibold">{plan.focus || 'Training Plan'}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1"> {/* Added a div to stack badges */}
                        <Badge className={`${getStatusChipColor(plan.status)} text-white text-xs px-2 py-0.5 rounded-full`}>
                            {getStatusText(plan.status)}
                        </Badge>
                        {plan.revised && ( // Conditionally render revised tag
                            <Badge className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                                Revisions Made
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
                <InfoRow icon={<Dna />} label="Sport" value={plan.athlete_profile?.sport} />
                <InfoRow icon={<Target />} label="Goal" value={plan.athlete_profile?.goal} />
                <InfoRow icon={<Clock />} label="Type" value={plan.type} transform={(v) => v?.charAt(0).toUpperCase() + v?.slice(1)} />
                <InfoRow icon={<Calendar />} label="Duration" value={plan.time_to_achieve} />
            </CardContent>

            <CardFooter className="pt-4">
                <div className="flex justify-between items-center w-full">
                    {plan.createdAt && (
                        <span className="text-xs text-gray-400">
                            Created: {format(new Date(plan.createdAt), 'MMM dd, yyyy')}
                        </span>
                    )}
                    <div className="flex flex-wrap gap-2"> {/* Container for action buttons */}
                        <Button
                            onClick={() => onOpenPlan(plan)}
                            className="bg-apts-lavender hover:bg-apts-lavender/90 text-white rounded-md px-4 py-2"
                        >
                            Open Plan
                        </Button>

                        {/* Restart button */}
                        {(plan.status === 'active' || plan.status === 'past_plan') && (userRole === 'athlete' || (userRole === 'coach' && plan.coachId === currentUserData?.uid)) && (
                            <Button onClick={() => onRestart(plan)} className="bg-apts-lavender hover:bg-apts-lavender/90 text-white rounded-md px-4 py-2">Restart</Button>
                        )}

                         {plan.status === 'active' && (userRole === 'athlete' || (userRole === 'coach' && plan.coachId === currentUserData?.uid)) && (
                            <Button
                                onClick={() => onStop(plan.id)} // Pass plan ID to stop function
                                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2"
                            >
                                Stop Plan
                            </Button>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

const InfoRow = ({ icon, label, value, transform }) => (
    <div className="flex items-center space-x-2 text-apts-text-light">
        {React.cloneElement(icon, { className: 'w-4 h-4 text-apts-lavender-light' })}
        <p>
            <span className="font-bold">{label}:</span>{' '}
            <span className={value ? '' : 'opacity-50'}>{transform ? transform(value) : value || 'N/A'}</span>
        </p>
    </div>
);