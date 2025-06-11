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
  AccordionItem,
} from '@heroui/react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

export const PlanViewModal = ({
  isOpen,
  onOpenChange,
  plan,
  hasCoach,
  userRole,
  onRevise,
  onApprove,
  onReject,
  showActions = false,
}) => {
  const currentUserData = useSelector((state) => state.user);

  if (!plan) return null;

  const parseTime = (timeStr) => {
    // Handle common time formats like "6AM", "8PM", "10 AM", "12 PM"
    const timeParts = timeStr.match(/(\d+)(?:\s*)(AM|PM)/i);
    if (!timeParts) return null;

    let hours = parseInt(timeParts[1], 10);
    const ampm = timeParts[2].toUpperCase();

    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      // Midnight (12 AM)
      hours = 0;
    }
    return hours; // Return hours for comparison
  };

  const renderPlanContent = () => {
    const entries = Object.entries(plan.plan || {});

    const sortedEntries = entries.sort(([keyA], [keyB]) => {
      // Case 1: D1, D2, etc. (Corrected regex)
      const dayRegex = /D(\d+)/i;
      const matchA = keyA.match(dayRegex);
      const matchB = keyB.match(dayRegex);

      if (matchA && matchB) {
        return parseInt(matchA[1], 10) - parseInt(matchB[1], 10);
      }
      if (matchA) return -1; // DX comes before other formats
      if (matchB) return 1;

      // Case 2: Time-based (e.g., "6AM", "8PM", "10 AM")
      const isTimeA = keyA.includes('AM') || keyA.includes('PM');
      const isTimeB = keyB.includes('AM') || keyB.includes('PM');

      if (isTimeA && isTimeB) {
        const timeA = parseTime(keyA);
        const timeB = parseTime(keyB);
        if (timeA !== null && timeB !== null) {
          return timeA - timeB;
        }
      }
      if (isTimeA) return -1; // Time comes before other formats (if no DayX)
      if (isTimeB) return 1;

      // Case 3: Fallback to alphabetical comparison for other keys
      return keyA.localeCompare(keyB);
    });

    return sortedEntries.map(([key, activities]) => {
      // Check if the key matches the "D X" format or the time format
      const isDayKey = /D(\d+)/i.test(key);
      const isTimeKey = key.includes('AM') || key.includes('PM');

      // Conditional classes for the title - apply if it's a Day key or a Time key
      const titleClasses =
        isDayKey || isTimeKey ? 'text-blue-400 font-semibold' : ''; // Apply the same styles

      return (
        <AccordionItem
          key={key}
          aria-label={key}
          title={key} // Keep the title as the string
          classNames={{
            title: titleClasses, // Apply specific class to the title text
            indicator: 'text-gray-300', // Explicitly set the indicator (icon) color to gray, or remove to default
            // You can also add other slots like:
            // trigger: "hover:bg-transparent",
            // base: "my-2",
          }}
        >
          <ul className='list-disc pl-5 text-khelverse-text-dark'>
            {activities.map((activity, idx) => (
              <li key={idx} className='mb-1'>
                {activity}
              </li>
            ))}
          </ul>
        </AccordionItem>
      );
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='3xl'
        scrollBehavior='inside'
        className='bg-transparent backdrop-blur-xl text-white'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-lavender font-sprintura'>
                Training Plan Details
              </ModalHeader>
              <ModalBody>
                <div className='mb-4'>
                  <p className='text-md font-semibold text-khelverse-text-dark'>
                    Focus: {plan.focus}
                  </p>
                  <p className='text-sm text-gray-400'>
                    Goal: <span className='text-gray-200'>{plan.athlete_profile?.goal}</span>
                  </p>
                  <p className='text-sm text-gray-400'>
                    Type: <span className='text-gray-200'>{plan.type}</span>
                  </p>
                  <p className='text-sm text-gray-400'>
                    Duration: <span className='text-gray-200'>{plan.time_to_achieve}</span>
                  </p>
                  {plan.weekStart && (
                    <p className='text-sm text-gray-400'>
                      Start Date:{' '}
                      <span className='text-gray-200'>
                        {format(new Date(plan.weekStart), 'MMM dd,yyyy')}
                      </span>
                    </p>
                  )}
                  {plan.status && (
                    <p className='text-sm text-gray-400'>
                      Status:{' '}
                      <span className='text-gray-200'>{plan.status.replace(/_/g, ' ')}</span>
                    </p>
                  )}
                  {plan.reviewNotes && plan.reviewNotes !== '' && (
                    <p className='text-sm text-gray-400'>
                      Coach Notes: <span className='text-gray-200'>{plan.reviewNotes}</span>
                    </p>
                  )}
                </div>
                <Accordion selectionMode='multiple' className='text-gray-100'>
                  {renderPlanContent()}
                </Accordion>
              </ModalBody>
              <ModalFooter className='flex flex-col md:flex-row justify-between items-center gap-3'>
                {showActions && userRole === 'coach' && (
                  <div className='flex gap-2'>
                    <Button
                      color='success'
                      onPress={() => {
                        console.log('approve please');
                        onApprove(plan.id);
                        onClose();
                      }}
                      disabled={plan.status !== 'waiting_for_approval'}
                    >
                      Approve
                    </Button>
                    <Button
                      color='warning'
                      onPress={() => {
                        onRevise(plan);
                        onClose();
                      }}
                    >
                      Revise
                    </Button>
                    <Button
                      color='danger'
                      onPress={() => {
                        onReject(plan.id);
                        onClose();
                      }}
                      disabled={plan.status !== 'waiting_for_approval'}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {userRole === 'athlete' &&
                  !hasCoach &&
                  (plan.status === 'active' || plan.status == 'waiting_for_approval') && (
                    <div className='flex gap-2'>
                      <Button color='success' onPress={() => onApprove(plan.id)}>
                        Approve
                      </Button>
                      <Button color='warning' onPress={() => onRevise(plan)}>
                        Revise
                      </Button>
                      <Button color='danger' onPress={() => onReject(plan.id)}>
                        Reject
                      </Button>
                    </div>
                  )}
                <Button
                  color='primary'
                  onPress={onClose}
                  className='bg-apts-purple-dark text-white hover:bg-apts-purple'
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlanViewModal;