'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  sport: z.string().min(1, "Please enter your sport"),
  level: z.string().min(1, "Please select your competition level"),
  experience: z.coerce.number().min(0, "Enter a valid experience (years)"),
  goal: z.string().min(1, "Please enter your career goal"),
  education_interest: z.string().min(1, "Please enter your education interest"),
  skills: z.string().min(1, "Please enter your skills"),
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
    },
  });

  return (
    <div className="animate-slide-in-up w-full max-w-3xl">
      <Card className="shadow-card">
        {/* <CardHeader className="bg-gradient-to-r from-violet to-lavender text-white">
          <CardTitle className="text-xl font-display flex items-center gap-2">
            Sports Career Questionnaire
          </CardTitle>
          <CardDescription className="text-white/80">
            Answer these questions and our AI will recommend optimal career paths for you.
          </CardDescription>
        </CardHeader> */}

        <CardContent className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sport & Experience */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Sport & Experience</h3>

              <div>
                <label className="block font-medium">What sport do you play?</label>
                <Input {...form.register("sport")} placeholder="e.g. Basketball, Swimming, Tennis" />
              </div>

              <div>
                <label className="block font-medium">What is your current competition level?</label>
                <Select onValueChange={(value) => form.setValue("level", value)}>
                  <SelectTrigger>
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
                <Input type="number" {...form.register("experience")} placeholder="e.g. 5" />
              </div>
            </div>

            {/* Career Goals */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Career Goals</h3>
              <div>
                <label className="block font-medium">What do you want to achieve?</label>
                <Input {...form.register("goal")} placeholder="e.g. Become a coach, expert, sports analyst, etc." />
              </div>
            </div>

            {/* Education Interest */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Education Interest</h3>
              <div>
                <label className="block font-medium">What area of education interests you?</label>
                <Input {...form.register("education_interest")} placeholder="e.g. B.Tech in Sports Science, MBA in Sports Management" />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Skills</h3>
              <div>
                <label className="block font-medium">Do you have any certifications or skills related to sports?</label>
                <Input {...form.register("skills")} placeholder="e.g. Judo, Yoga Certification, Personal Training, etc." />
              </div>
            </div>

            <Button type="submit" className="w-full bg-lavender text-black hover:bg-black hover:text-lavender transition-all duration-500">
              Generate Career Advice
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerAdviceForm;
