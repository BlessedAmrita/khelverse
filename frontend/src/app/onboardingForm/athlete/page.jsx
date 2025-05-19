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
import { setRole } from '@/config/slices/userSlice'; // Import Redux action

export default function AthleteOnboarding() {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user); // ✅ Get user from Redux

  const [formData, setFormData] = useState({
    role: 'athlete', // ✅ Ensure role is included
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // ✅ Updated submission function
  const handleSubmit = async () => {
    try {
      await submitOnboarding(formData, user, router, dispatch, setRole);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-6 bg-apts-dark'>
      {step === 1 && <Step1 formData={formData} setFormData={setFormData} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} />}
      {step === 3 && <Step3 formData={formData} setFormData={setFormData} />}
      {step === 4 && <Step4 formData={formData} setFormData={setFormData} />}

      <div className='flex justify-between mt-4'>
        {step > 1 && <Button onClick={prevStep} className=' bg-purple-dark text-lavender-100'>Back</Button>}
        {step < 4 ? (
          <Button onClick={nextStep} className=' bg-purple-dark text-lavender-100 px-8'>Next</Button>
        ) : (
          <Button onClick={handleSubmit} className=' bg-purple-dark text-lavender-100'>Submit</Button>
        )}
      </div>
    </div>
  );
}
