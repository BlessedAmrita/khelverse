'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Step1 from '@/components/onBoardingForm/athlete/Step1';
import Step2 from '@/components/onBoardingForm/athlete/Step2';
import Step3 from '@/components/onBoardingForm/athlete/Step3';
import Step4 from '@/components/onBoardingForm/athlete/Step4';
import { Button } from '@/components/ui/button';
import { submitOnboarding } from '@/components/onBoardingForm/submitOnboarding';
import { setRole } from '@/config/slices/userSlice';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '@/schemas/athleteSchema';

const schemas = [step1Schema, step2Schema, step3Schema, step4Schema];

export default function AthleteOnboarding() {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);

  // Initialize useForm hook with schema based on the current step
  const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schemas[step - 1]),
    defaultValues: {
      firstName: '',
      lastName: '',
      dob: '',
      gender: 'Male',
      sport: '',
      experienceLevel: 'Beginner',
      height: '',
      weight: '',
      medicalHistory: '',
      achievements: '',
    },
  });

  const handleNextStep = async () => {
    // Trigger form validation before proceeding to the next step
    const isValid = await trigger();
    if (isValid) setStep((prev) => prev + 1); // If valid, go to the next step
  };

  const handlePrevStep = () => setStep((prev) => prev - 1); // Go to the previous step

  const onSubmit = async (data) => {
    try {
      // Submit the data when the last step is reached
      await submitOnboarding(data, user, router, dispatch, setRole);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-6'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Render the steps based on the current step */}
        {step === 1 && <Step1 register={register} errors={errors} />}
        {step === 2 && <Step2 register={register} errors={errors} />}
        {step === 3 && <Step3 register={register} errors={errors} />}
        {step === 4 && <Step4 register={register} errors={errors} />}

        {/* Step navigation buttons */}
        <div className='flex justify-between mt-4'>
          {step > 1 && <Button onClick={handlePrevStep}>Back</Button>}
          {step < 4 ? (
            <Button type="button" onClick={handleNextStep}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button> // This will trigger the form submission
          )}
        </div>
      </form>
    </div>
  );
}
