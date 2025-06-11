'use client';
import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Accordion,
    AccordionItem
} from "@heroui/react";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

export const PlanViewModal = ({
    isOpen,
    onOpenChange,
    plan,
    hasCoach, // This prop seems related to athlete context, not strictly needed for coach actions
    userRole,
    onRevise,
    onApprove,
    onReject,
    showActions = false // <--- NEW PROP: Controls visibility of coach action buttons
}) => {
    const currentUserData = useSelector((state) => state.user);

    if (!plan) return null;

    const renderPlanContent = () => {
        const entries = Object.entries(plan.plan || {});

        const sortedEntries = entries.sort(([a], [b]) => {
            // Try to extract day number if format is like "Day 1"
            const dayRegex = /Day\s*(\d+)/i;
            const aMatch = a.match(dayRegex);
            const bMatch = b.match(dayRegex);

            if (aMatch && bMatch) {
                return parseInt(aMatch[1]) - parseInt(bMatch[1]);
            }

            // Try to parse as date
            const aDate = new Date(a);
            const bDate = new Date(b);
            if (!isNaN(aDate) && !isNaN(bDate)) {
                return aDate - bDate;
            }

            // Fallback to string comparison
            return a.localeCompare(b);
        });

        return sortedEntries.map(([key, activities]) => (
            <AccordionItem key={key} aria-label={key} title={key}>
                <ul className="list-disc pl-5 text-khelverse-text-dark">
                    {activities.map((activity, idx) => (
                        <li key={idx} className="mb-1">{activity}</li>
                    ))}
                </ul>
            </AccordionItem>
        ));
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-khelverse-primary">
                                Training Plan Details
                            </ModalHeader>
                            <ModalBody>
                                <div className="mb-4">
                                    <p className="text-md font-semibold text-khelverse-text-dark">Focus: {plan.focus}</p>
                                    <p className="text-sm text-gray-600">Goal: {plan.athlete_profile?.goal}</p>
                                    <p className="text-sm text-gray-600">Type: {plan.type}</p>
                                    <p className="text-sm text-gray-600">Duration: {plan.time_to_achieve}</p>
                                    {plan.weekStart && (
                                        <p className="text-sm text-gray-600">
                                            Start Date: {format(new Date(plan.weekStart), 'MMM dd, yyyy')}
                                        </p>
                                    )}
                                    {plan.status && (
                                        <p className="text-sm text-gray-600">
                                            Status: {plan.status.replace(/_/g, ' ')} {/* Display status nicely */}
                                        </p>
                                    )}
                                    {plan.reviewNotes && plan.reviewNotes !== "" && (
                                        <p className="text-sm text-gray-600">
                                            Coach Notes: {plan.reviewNotes}
                                        </p>
                                    )}
                                </div>
                                <Accordion selectionMode="multiple">
                                    {renderPlanContent()}
                                </Accordion>
                            </ModalBody>
                            <ModalFooter className="flex flex-col md:flex-row justify-between items-center gap-3">
                                {/* Conditional rendering based on showActions prop and user role */}
                                {showActions && userRole === 'coach' && ( // Only show actions if showActions is true AND it's a coach
                                    <div className="flex gap-2">
                                        <Button
                                            color="success"
                                            onPress={() => { console.log("approve please"); onApprove(plan.id); onClose(); }} // Add onClose
                                            disabled={plan.status !== 'waiting_for_approval'}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            color="warning"
                                            onPress={() => { onRevise(plan); onClose(); }} // Add onClose
                                        >
                                            Revise
                                        </Button>
                                        <Button
                                            color="danger"
                                            onPress={() => { onReject(plan.id); onClose(); }} // Add onClose
                                            disabled={plan.status !== 'waiting_for_approval'}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                                {/* For athletes not having coaches */}
                                {userRole === 'athlete' && !hasCoach && (plan.status === 'active' || plan.status == 'waiting_for_approval')  && (
                                    <div className="flex gap-2">
                                        <Button
                                            color="success"
                                            onPress={() => onApprove(plan.id)} 
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            color="warning"
                                            onPress={() => onRevise(plan)} 
                                        >
                                            Revise
                                        </Button>
                                        <Button
                                            color="danger"
                                            onPress={() => onReject(plan.id)}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                )}
                                <Button color="primary" onPress={onClose}>Close</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default PlanViewModal; // Export as default for consistency