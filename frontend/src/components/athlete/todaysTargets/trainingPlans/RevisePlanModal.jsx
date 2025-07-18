'use client';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Spinner,
} from '@heroui/react';
import { useSelector } from 'react-redux';

export const RevisePlanModal = ({ isOpen, onOpenChange, plan, onSubmit }) => {
  // Added onSubmit prop
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const currentUser = useSelector((state) => state.user); // Firestore user doc

  useEffect(() => {
    if (isOpen) {
      setReviewFeedback('');
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, plan]);

  const handleSubmit = async () => {
    if (!reviewFeedback.trim()) {
      setSubmitError('Please provide feedback for the revision.');
      return;
    }

    if (!currentUser) {
      setSubmitError('User info not available. Try reloading.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Call the onSubmit prop passed from YourPlansMain, which then calls reviseExistingPlan
      await onSubmit(plan, reviewFeedback);
      // toast.success("Revised plan submitted successfully."); // Toast handled by parent now
      onOpenChange(false);
    } catch (err) {
      console.error('Error submitting revision:', err);
      // toast.error("Something went wrong while submitting the revision."); // Toast handled by parent now
      setSubmitError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isSubmitting}
      isKeyboardDismissDisabled={isSubmitting}
    >
      <ModalContent className='bg-transparent backdrop-blur-xl border border-white/20 text-apts-lavender'>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1 font-sprintura text-lavender'>
              Revise Plan for {plan?.focus || 'N/A'}
            </ModalHeader>
            <ModalBody>
              <p className='text-sm text-gray-200 mb-4'>
                Provide detailed feedback or specific changes you want for this plan.
              </p>
              <label className='text-gray-200 text-md font-semibold text-lavender-200'>Revision Feedback</label>
              <Textarea
                placeholder="e.g., 'Adjust cardio intensity'..."
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                className='mb-4 border border-white/10'
                variant='bordered'
                classNames={{
                  input: 'bg-apts-lightdark text-white placeholder:text-gray-400',
                  inputWrapper:
                    'border-apts-border hover:border-apts-lavender focus-within:!border-apts-lavender',
                }}
                disabled={isSubmitting}
              />
              {submitError && <p className='text-red-500 text-sm mb-4'>{submitError}</p>}
            </ModalBody>
            <ModalFooter>
              <Button
                color='danger'
                variant='light'
                onPress={onClose}
                isDisabled={isSubmitting}
                className='bg-red-700 text-white hover:bg-red-600'
              >
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleSubmit}
                isDisabled={isSubmitting}
                className='bg-apts-purple-dark text-white hover:bg-apts-purple'
              >
                {isSubmitting ? <Spinner size='sm' color='white' /> : 'Submit Revision'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
