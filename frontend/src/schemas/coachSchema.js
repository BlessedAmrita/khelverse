import { z } from 'zod';

// Step 1: Personal Info
export const coachStep1Schema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .regex(/^[A-Za-z]+$/, { message: '(only alphabets allowed)' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .regex(/^[A-Za-z]+$/, { message: '(only alphabets allowed)' }),
  dob: z
    .string()
    .refine((val) => {
      const dob = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      const ageFinal = m < 0 || (m === 0 && today.getDate() < dob.getDate()) ? age - 1 : age;
      return ageFinal >= 10 && ageFinal <= 150;
    }, {
      message: 'Age must be between 10 and 150 years',
    }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
});

// Step 2 (Coaching Experience)
export const coachStep2Schema = z.object({
  sport: z.string().min(1, { message: 'Sport is required' }),
  expertise: z
    .array(z.string())
    .min(1, { message: 'Select at least one area of expertise' }),
  experience: z
    .string()
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    }, { message: 'Experience must be a number 0 or more' }),
  level: z.enum(['Beginner', 'Intermediate', 'Pro'], {
    errorMap: () => ({ message: 'Level is required' }),
  }),
  trainingMode: z.enum(['Online', 'Offline', 'Hybrid'], {
    errorMap: () => ({ message: 'Training mode is required' }),
  }),
  certifications: z.array(z.string()).optional(),
});
