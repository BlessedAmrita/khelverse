'use client';
import React from 'react';
import CoachPlanCard from './CoachPlanCard';
import { useDisclosure } from "@heroui/react";
import { PlanViewModal } from '@/components/athlete/todaysTargets/trainingPlans/PlanViewModal';
import { useSelector } from 'react-redux'; 

const ReviewedPlanCard = ({ plan }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const user = useSelector((state) => state.user); // Get user role from Redux

    const handleViewPlan = () => {
        onOpen();
    };

    return (
        <>
            {/* CoachPlanCard acts as the entry point to view the plan */}
            <CoachPlanCard
                plan={plan}
                onOpenPlan={handleViewPlan} 
                showReviewButtons={false} 
            />

            {/* Plan View Modal: Displays plan details without coach actions */}
            <PlanViewModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                plan={plan}
                userRole={user?.role} 
                hasCoach={true} 
                showActions={false} 
            />
        </>
    );
};

export default ReviewedPlanCard;