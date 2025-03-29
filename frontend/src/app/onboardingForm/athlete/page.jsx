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
import athleteSchema from '@/schemas/athleteSchema';

export default function AthleteOnboarding() {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      role: 'athlete',
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data) => {
    try {
      await submitOnboarding(data, user, router, dispatch, setRole);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-6'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && <Step1 register={register} errors={errors} />}
        {step === 2 && <Step2 register={register} errors={errors} />}
        {step === 3 && <Step3 register={register} errors={errors} />}
        {step === 4 && <Step4 register={register} errors={errors} />}

        <div className='flex justify-between mt-4'>
          {step > 1 && <Button onClick={prevStep}>Back</Button>}
          {step < 4 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button type='submit'>Submit</Button>
          )}
        </div>
      </form>
    </div>
  );
}
