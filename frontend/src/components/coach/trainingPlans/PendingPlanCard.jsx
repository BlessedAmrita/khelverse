'use client';
import React, { useState } from 'react';
import { useDisclosure } from "@heroui/react";
import { useSelector } from "react-redux";
import CoachPlanCard from './CoachPlanCard';
import { PlanViewModal } from '@/components/athlete/todaysTargets/trainingPlans/PlanViewModal';
import { RevisePlanModal } from '@/components/athlete/todaysTargets/trainingPlans/RevisePlanModal';
import { usePlans } from '@/hooks/usePlans';
import { toast } from 'sonner';

// Receive onPlanUpdated as a prop
const PendingPlanCard = ({ plan, onPlanUpdated }) => {
    const { isOpen: isPlanViewModalOpen, onOpen: onOpenPlanViewModal, onOpenChange: onPlanViewModalChange } = useDisclosure();
    const { isOpen: isReviseModalOpen, onOpen: onOpenReviseModal, onOpenChange: onReviseModalChange } = useDisclosure();

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPlanToRevise, setSelectedPlanToRevise] = useState(null);

    const user = useSelector((state) => state.user);

    const {
        reviseExistingPlan,
        updatePlanApprovalStatus,
        // Removed fetchPlans from here, as we're using the prop
    } = usePlans();

    const handleOpenForReview = () => {
        setSelectedPlan(plan);
        onOpenPlanViewModal();
    };

    const handleOpenReviseModal = () => {
        setSelectedPlanToRevise(selectedPlan);
        onPlanViewModalChange(false);
        onOpenReviseModal();
    };

    const handleRevisePlan = async (planFromModal, reviewFeedbackFromModal) => {
        console.log("Coach side - handleRevisePlan received: Plan:", planFromModal, "Feedback:", reviewFeedbackFromModal);

        const planToSubmit = planFromModal;
        const actualReviewString = reviewFeedbackFromModal;

        if (!planToSubmit || !actualReviewString) {
            toast.error("Error: Missing plan or review feedback for revision.");
            return;
        }

        try {
            const success = await reviseExistingPlan(planToSubmit, actualReviewString);

            if (success) {
                toast.success('Plan revised successfully!');
                onReviseModalChange(false);
                setSelectedPlanToRevise(null);
                // Call the prop to trigger re-fetch in the parent component
                if (onPlanUpdated) {
                    onPlanUpdated();
                }
            } else {
                toast.error('Failed to revise plan.');
            }
        } catch (err) {
            console.error("Error revising plan:", err);
            toast.error(`Error: ${err.message}`);
        }
    };

    const handleApprovePlan = async () => {
        if (!selectedPlan) return;
        console.log("Approving plan with ID:", selectedPlan.id);
        try {
            const success = await updatePlanApprovalStatus(selectedPlan.id, 'active');
            if (success) {
                toast.success('Plan approved!');
                onPlanViewModalChange(false);
                setSelectedPlan(null);
                // Call the prop to trigger re-fetch in the parent component
                if (onPlanUpdated) {
                    onPlanUpdated();
                }
            } else {
                toast.error('Failed to approve plan.');
            }
        } catch (err) {
            console.error("Error approving plan:", err);
            toast.error(`Error: ${err.message}`);
        }
    };

    const handleRejectPlan = async () => {
        if (!selectedPlan) return;
        try {
            const success = await updatePlanApprovalStatus(selectedPlan.id, 'rejected');
            if (success) {
                toast.info('Plan rejected.');
                onPlanViewModalChange(false);
                setSelectedPlan(null);
                // Call the prop to trigger re-fetch in the parent component
                if (onPlanUpdated) {
                    onPlanUpdated();
                }
            } else {
                toast.error('Failed to reject plan.');
            }
        } catch (err) {
            console.error("Error rejecting plan:", err);
            toast.error(`Error: ${err.message}`);
        }
    };

    return (
        <div>
            <CoachPlanCard
                plan={plan}
                onOpenPlan={handleOpenForReview}
                showReviewButtons={true}
            />

            <PlanViewModal
                isOpen={isPlanViewModalOpen}
                onOpenChange={onPlanViewModalChange}
                plan={selectedPlan}
                userRole={user?.role}
                hasCoach={true}
                onRevise={handleOpenReviseModal}
                onApprove={handleApprovePlan}
                onReject={handleRejectPlan}
                showActions={true}
            />

            {selectedPlanToRevise && (
                <RevisePlanModal
                    isOpen={isReviseModalOpen}
                    onOpenChange={onReviseModalChange}
                    plan={selectedPlanToRevise}
                    onSubmit={handleRevisePlan}
                />
            )}
        </div>
    );
};

export default PendingPlanCard;