'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const indianLanguages = [
  'Assamese',
  'Bengali',
  'Dogri',
  'English',
  'Gujarati',
  'Hindi',
  'Kannada',
  'Konkani',
  'Maithili',
  'Malayalam',
  'Marathi',
  'Nepali',
  'Odia',
  'Punjabi',
  'Sanskrit',
  'Sindhi',
  'Tamil',
  'Telugu',
  'Urdu',
];
// Define the Zod schema
const formSchema = z.object({
  age: z.coerce.number().min(10, 'Minimum age is 10').max(50, 'Maximum age is 50'),
  sport: z.string().min(1, 'Sport is required'),
  injury_type: z.string().min(3, 'Injury type is required'),
  past_injuries: z.string().optional(),
  mobility: z.coerce.number().int().min(1).max(3),
  pressure: z.coerce.number().int().min(1).max(3),
  weight_bearing: z.coerce.number().int().min(1).max(3),
  language: z.string().min(1, 'Please select a language'),
});

export default function InjuryAssessmentForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 18,
      sport: '',
      injury_type: '',
      past_injuries: '',
      mobility: 1,
      pressure: 1,
      weight_bearing: 1,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 p-6 border rounded-lg shadow-md w-full max-w-2xl bg-white'
      >
        {/* Age */}
        <FormField
          control={form.control}
          name='age'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Enter age' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sport */}
        <FormField
          control={form.control}
          name='sport'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport Played</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Enter your sport' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Injury Type */}
        <FormField
          control={form.control}
          name='injury_type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Injury Type</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Describe the injury' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Past Injuries */}
        <FormField
          control={form.control}
          name='past_injuries'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Past Injuries (Optional)</FormLabel>
              <FormControl>
                <Input type='text' placeholder='Previous injuries' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mobility Test */}
        <FormField
          control={form.control}
          name='mobility'
          render={({ field }) => (
            <FormItem>
              <FormLabel>⚡ Mobility Test</FormLabel>
              <p className='text-sm text-gray-500'>
                Try moving the injured area slowly. Rate pain (1 = Low, 2 = Medium, 3 = High).
              </p>
              <FormControl>
                <div className='flex gap-4'>
                  {[1, 2, 3].map((value) => (
                    <label key={value} className='flex items-center gap-2'>
                      <input
                        type='radio'
                        value={value}
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pressure Test */}
        <FormField
          control={form.control}
          name='pressure'
          render={({ field }) => (
            <FormItem>
              <FormLabel>💪 Pressure Test</FormLabel>
              <p className='text-sm text-gray-500'>
                Apply light pressure to the injured area. Rate pain (1 = Low, 2 = Medium, 3 = High).
              </p>
              <FormControl>
                <div className='flex gap-4'>
                  {[1, 2, 3].map((value) => (
                    <label key={value} className='flex items-center gap-2'>
                      <input
                        type='radio'
                        value={value}
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weight-Bearing Test */}
        <FormField
          control={form.control}
          name='weight_bearing'
          render={({ field }) => (
            <FormItem>
              <FormLabel>🦵 Weight-Bearing Test</FormLabel>
              <p className='text-sm text-gray-500'>
                Try standing or applying weight on the injured area. Rate pain (1 = Low, 2 = Medium,
                3 = High).
              </p>
              <FormControl>
                <div className='flex gap-4'>
                  {[1, 2, 3].map((value) => (
                    <label key={value} className='flex items-center gap-2'>
                      <input
                        type='radio'
                        value={value}
                        checked={field.value === value}
                        onChange={() => field.onChange(value)}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Language Selection */}
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Language</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => form.setValue('language', value)} {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select language' />
                  </SelectTrigger>
                  <SelectContent>
                    {indianLanguages.map((language, index) => (
                      <SelectItem key={index} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type='submit'
          className='w-full  bg-lavender text-black rounded-lg shadow-md hover:bg-black hover:text-lavender transition-colors duration-500'
        >
          Get Recovery Plan
        </Button>
      </form>
    </Form>
  );
}
