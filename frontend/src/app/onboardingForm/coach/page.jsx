'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Step1 from '@/components/onBoardingForm/coach/Step1';
import Step2 from '@/components/onBoardingForm/coach/Step2';
import { Button } from '@/components/ui/button';
import { submitOnboarding } from '@/components/onBoardingForm/submitOnboarding';
import { setRole } from '@/config/slices/userSlice';
import { coachStep1Schema, coachStep2Schema } from '@/schemas/coachSchema';

export default function CoachOnboarding() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    role: 'coach',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    city: '',
    state: '',
    experience: '',
    certifications: '',
    expertise: [],
    sport: '',
    level: 'Beginner',
    trainingMode: 'Online',
  });

  const nextStep = () => {
    const validation = coachStep1Schema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
    } else {
      setErrors({});
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    const validation = coachStep2Schema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors(fieldErrors);
    } else {
      setErrors({});
      const processedFormData = {
        ...formData,
        expertise: formData.expertise.join(', '),
        certifications: formData.certifications.join(', '),
      };
      try {
        await submitOnboarding(processedFormData, user, router, dispatch, setRole);
      } catch (error) {
        console.error('Form submission failed:', error);
      }
    }
  };

  return (
    <div className='max-w-lg mx-auto p-6'>
      {step === 1 && <Step1 formData={formData} setFormData={setFormData} errors={errors} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} errors={errors} />}

      <div className='flex justify-between mt-4'>
        {step > 1 && (
          <Button onClick={() => setStep(1)} className='bg-purple-dark text-lavender-100 px-8'>Back</Button>
        )}
        {step < 2 ? (
          <Button onClick={nextStep} className='bg-purple-dark text-lavender-100 px-8'>Next</Button>
        ) : (
          <Button onClick={handleSubmit} className='bg-purple-dark text-lavender-100'>Submit</Button>
        )}
      </div>
    </div>
  );
}
