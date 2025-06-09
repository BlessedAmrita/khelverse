'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Step1 from '@/components/onBoardingForm/athlete/Step1';
import Step2 from '@/components/onBoardingForm/athlete/Step2';
import Step3 from '@/components/onBoardingForm/athlete/Step3';
import Step4 from '@/components/onBoardingForm/athlete/Step4';
import { Button } from '@/components/ui/button';
import { submitOnboarding } from '@/components/onBoardingForm/submitOnboarding';
import { setRole } from '@/config/slices/userSlice';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from '@/schemas/athleteSchema';

export default function AthleteOnboarding() {
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    role: 'athlete',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    city: '',
    state: '',
    sport: '',
    experienceLevel: 'Beginner',
    height: '',
    weight: '',
    medicalHistory: '',
    achievements: '',
  });

  const validateStep = async () => {
    let schema;
    switch (step) {
      case 1:
        schema = step1Schema;
        break;
      case 2:
        schema = step2Schema;
        break;
      case 3:
        schema = step3Schema;
        break;
      default:
        schema = null;
    }

    if (!schema) return true;

    try {
      await schema.parseAsync(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setFormErrors(formattedErrors);
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      await submitOnboarding(formData, user, router, dispatch, setRole);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-6 bg-apts-dark'>
      {step === 1 && (
        <Step1
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
        />
      )}
      {step === 2 && (
        <Step2
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
        />
      )}
      {step === 3 && (
        <Step3
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
        />
      )}
      {step === 4 && (
        <Step4
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
        />
      )}

      <div className='flex justify-between mt-4'>
        {step > 1 && (
          <Button onClick={prevStep} className='bg-purple-dark text-lavender-100'>
            Back
          </Button>
        )}
        {step < 4 ? (
          <Button onClick={nextStep} className='bg-purple-dark text-lavender-100 px-8'>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className='bg-purple-dark text-lavender-100'>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
