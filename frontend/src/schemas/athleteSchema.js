import { z } from 'zod';

// Helper: Date of Birth Age Validator
const dobValidator = z
  .string()
  .refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      return age - 1 >= 10 && age - 1 <= 150;
    }
    return age >= 10 && age <= 150;
  }, (val) => {
    const dob = new Date(val);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (isNaN(dob.getTime())) return { message: 'Please enter a valid date of birth' };
    if (age < 10) return { message: 'You must be at least 10 years old' };
    if (age > 150) return { message: 'Age cannot be more than 150 years' };
    return { message: 'Invalid Date of Birth' };
  });

// Step 1: Personal Information
export const step1Schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }).regex(/^[A-Za-z]+$/, { message: '(only alphabets allowed)' }),
  lastName: z.string().min(1, { message: 'Last name is required' }).regex(/^[A-Za-z]+$/, { message: '(only alphabets allowed)' }),
  dob: dobValidator,
  gender: z.string().min(1, { message: 'Gender is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
});

// Step 2: Sport & Experience
export const step2Schema = z.object({
  sport: z.string().min(1, { message: 'Please select a sport' }),
  experienceLevel: z
    .string()
    .min(1, { message: 'Experience level is required' }),
});

// Step 3: Physical Stats & Medical
export const step3Schema = z.object({
  height: z
    .string()
    .refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 50 && num <= 272;
    }, { message: 'Height must be between 50cm and 272cm' }),
  weight: z
    .string()
    .refine(val => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 20 && num <= 300;
    }, { message: 'Weight must be between 20kg and 300kg' }),
  medicalHistory: z.string().optional(),
});

// Step 4: Achievements
export const step4Schema = z.object({
  achievements: z.string().optional(),
});
