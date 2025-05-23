'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const schema = z.object({
  athlete_id: z.string().min(1, 'Athlete ID is required'),
  age: z.coerce.number().min(10).max(50),
  height_cm: z.coerce.number().min(100).max(250),
  weight_kg: z.coerce.number().min(30).max(200),
  sport: z.string().min(1, 'Sport is required'),
  role_in_sport: z.string().min(1, 'Role is required'),
  dominant_side: z.enum(['Right', 'Left']),
  activity_level: z.enum(['Professional', 'Amateur', 'Recreational']),
  years_experience_sport: z.coerce.number().min(0).max(50),
  training_volume_hours_per_week: z.coerce.number().min(0).max(168),
});

export default function Step1AthleteData({ data, updateData, nextStep }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: data.athlete_data,
  });

  function onSubmit(formValues) {
    updateData('athlete_data', formValues);
    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="athlete_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Athlete Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height_cm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Cricket" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_in_sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role in Sport</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fast Bowler" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dominant_side"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dominant Side</FormLabel>
              <select {...field} className="w-full rounded border p-2 bg-apts-dark text-white border-white/20">
                <option value="">Select</option>
                <option value="Right">Right</option>
                <option value="Left">Left</option>
              </select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activity_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Level</FormLabel>
              <select {...field} className="w-full rounded border p-2 bg-apts-dark text-white border-white/20">
                <option value="">Select</option>
                <option value="Professional">Professional</option>
                <option value="Amateur">Amateur</option>
                <option value="Recreational">Recreational</option>
              </select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="years_experience_sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience in Sport</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="training_volume_hours_per_week"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training Volume (hours/week)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-4">
          Next
        </Button>
      </form>
    </Form>
  );
}
