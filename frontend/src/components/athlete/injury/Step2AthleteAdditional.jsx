'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    previous_injuries: z.string().optional(),
    medical_conditions: z.string().optional(),
    specific_goals_recovery: z.string().min(1, 'Please specify your recovery goals'),
    access_to_facilities: z.string().optional(),
    psychological_factors: z.string().optional(),
    current_medications_supplements: z.string().optional(),
    dietary_preferences_restrictions: z.string().optional(),
});

export default function Step2AthleteAdditional({ data, updateData, nextStep, prevStep }) {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            previous_injuries: (data.previous_injuries || []).join(', '),
            medical_conditions: (data.medical_conditions || []).join(', '),
            specific_goals_recovery: data.specific_goals_recovery || '',
            access_to_facilities: (data.access_to_facilities || []).join(', '),
            psychological_factors: (data.psychological_factors || []).join(', '),
            current_medications_supplements: (data.current_medications_supplements || []).join(', '),
            dietary_preferences_restrictions: (data.dietary_preferences_restrictions || []).join(', '),
        },
    });

    function onSubmit(formValues) {
        updateData('athlete_data', {
            previous_injuries: formValues.previous_injuries?.split(',').map(s => s.trim()) || [],
            medical_conditions: formValues.medical_conditions?.split(',').map(s => s.trim()) || [],
            specific_goals_recovery: formValues.specific_goals_recovery,
            access_to_facilities: formValues.access_to_facilities?.split(',').map(s => s.trim()) || [],
            psychological_factors: formValues.psychological_factors?.split(',').map(s => s.trim()) || [],
            current_medications_supplements: formValues.current_medications_supplements?.split(',').map(s => s.trim()) || [],
            dietary_preferences_restrictions: formValues.dietary_preferences_restrictions?.split(',').map(s => s.trim()) || [],
        });

        nextStep();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="previous_injuries"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Previous Injuries (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. ACL tear, Sprained Ankle" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="medical_conditions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Medical Conditions (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Asthma, Diabetes" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="specific_goals_recovery"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Specific Goals of Recovery</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your goals" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="access_to_facilities"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Access to Facilities (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Gym, Physiotherapy" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="psychological_factors"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Psychological Factors (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Anxiety, Motivation issues" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="current_medications_supplements"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Medications/Supplements (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Ibuprofen, Protein supplements" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dietary_preferences_restrictions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dietary Preferences/Restrictions (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Vegan, Lactose intolerant" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={prevStep}>
                        Previous
                    </Button>
                    <Button type="submit">Next</Button>
                </div>
            </form>
        </Form>
    );
}
