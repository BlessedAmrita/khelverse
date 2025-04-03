'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// List of Indian languages for selection (can be extended as needed)
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

const formSchema = z.object({
  sport: z.string().min(1, "Please enter your sport"),
  level: z.string().min(1, "Please select your competition level"),
  experience: z.coerce.number().min(0, "Enter a valid experience (years)"),
  goal: z.string().min(1, "Please enter your career goal"),
  education_interest: z.string().min(1, "Please enter your education interest"),
  skills: z.string().min(1, "Please enter your skills"),
  language: z.string().min(1, "Please select a language"),
});

const CareerAdviceForm = ({ onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sport: "",
      level: "",
      experience: "",
      goal: "",
      education_interest: "",
      skills: "",
      language: "English",  // Default language
    },
  });

  return (
    <div className="animate-slide-in-up w-full max-w-3xl bg-black">
      <Card className=" bg-apts-dark text-white">
        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sport & Experience */}
            <div className="space-y-4">
              <h3 className="font-medium text-xl text-lavender-300">Sport & Experience</h3>

              <div>
                <label className="block font-medium">What sport do you play?</label>
                <Input {...form.register("sport")} placeholder="e.g. Basketball, Swimming, Tennis" className="border border-white/20 bg-transparent text-white"/>
              </div>

              <div>
                <label className="block font-medium">What is your current competition level?</label>
                <Select onValueChange={(value) => form.setValue("level", value)}>
                  <SelectTrigger className="border border-white/20 bg-transparent text-white">
                    <SelectValue placeholder="Select your competition level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="state">State</SelectItem>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                    <SelectItem value="recreational">Recreational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block font-medium">How many years have you been in this sport?</label>
                <Input type="number" {...form.register("experience")} placeholder="e.g. 5" className="border border-white/20 bg-transparent text-white" />
              </div>
            </div>

            {/* Career Goals */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Career Goals</h3>
              <div>
                <label className="block font-medium">What do you want to achieve?</label>
                <Input {...form.register("goal")} placeholder="e.g. Become a coach, expert, sports analyst, etc." className="border border-white/20 bg-transparent text-white"/>
              </div>
            </div>

            {/* Education Interest */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Education Interest</h3>
              <div>
                <label className="block font-medium">What area of education interests you?</label>
                <Input {...form.register("education_interest")} placeholder="e.g. B.Tech in Sports Science, MBA in Sports Management" className="border border-white/20 bg-transparent text-white"/>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Skills</h3>
              <div>
                <label className="block font-medium">Do you have any certifications or skills related to sports?</label>
                <Input {...form.register("skills")} placeholder="e.g. Judo, Yoga Certification, Personal Training, etc." className="border border-white/20 bg-transparent text-white" />
              </div>
            </div>

            {/* Language Dropdown */}
            <div>
              <label className="block font-medium">Select Language</label>
              <Select onValueChange={(value) => form.setValue("language", value)}>
                <SelectTrigger className="border border-white/20 bg-transparent text-white">
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
            </div>

            <Button type="submit" className="w-full bg-purple-dark text-lavender-200 hover:bg-black hover:text-lavender transition-all duration-500">
              Generate Career Advice
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerAdviceForm;
