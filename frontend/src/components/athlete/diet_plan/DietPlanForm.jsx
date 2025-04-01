"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const indianLanguages = [
  'Assamese', 'Bengali', 'Dogri', 'English', 'Gujarati', 'Hindi', 'Kannada',
  'Konkani', 'Maithili', 'Malayalam', 'Marathi', 'Nepali', 'Odia', 'Punjabi',
  'Sanskrit', 'Sindhi', 'Tamil', 'Telugu', 'Urdu',
];

// Define the Zod schema to match API request structure
const formSchema = z.object({
  sport: z.string().min(1, "Sport is required"),
  position: z.string().optional(),
  age: z.coerce.number().min(10, "Minimum age is 10").max(50, "Maximum age is 50"),
  weight: z.coerce.number().min(30, "Minimum weight is 30kg").max(200, "Maximum weight is 200kg"),
  height: z.coerce.number().min(100, "Minimum height is 100cm").max(250, "Maximum height is 250cm"),
  goal: z.string().min(1, "Goal is required"),
  language: z.string().min(1, "Please select a language"),
});

export default function DietPlanForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sport: "",
      position: "",
      age: 30,
      weight: 60,
      height: 180,
      goal: "",
      language: "English", 
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-6 border rounded-lg shadow-md w-full max-w-2xl bg-white"
      >
        {/* Sport */}
        <FormField control={form.control} name="sport" render={({ field }) => (
          <FormItem>
            <FormLabel>Sport Played</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter your sport" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Position */}
        <FormField control={form.control} name="position" render={({ field }) => (
          <FormItem>
            <FormLabel>Position (Optional)</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter your position" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Age */}
        <FormField control={form.control} name="age" render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter age" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Weight */}
        <FormField control={form.control} name="weight" render={({ field }) => (
          <FormItem>
            <FormLabel>Weight (kg)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter weight in kg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Height */}
        <FormField control={form.control} name="height" render={({ field }) => (
          <FormItem>
            <FormLabel>Height (cm)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter height in cm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Goal */}
        <FormField control={form.control} name="goal" render={({ field }) => (
          <FormItem>
            <FormLabel>Training Goal</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter your training goal" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Language Selection */}
        <FormField control={form.control} name="language" render={({ field }) => (
          <FormItem>
            <FormLabel>Select Language</FormLabel>
            <FormControl>
              <Select onValueChange={(value) => form.setValue("language", value)} {...field}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
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
        )} />

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-lavender text-black rounded-lg shadow-md hover:bg-black hover:text-lavender transition-colors duration-500">
          Generate Diet Plan
        </Button>
      </form>
    </Form>
  );
}
