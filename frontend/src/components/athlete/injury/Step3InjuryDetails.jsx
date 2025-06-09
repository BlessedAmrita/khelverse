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
    injury_type: z.string().min(1, 'Injury Type required'),
    body_part: z.string().min(1, 'Body Part required'),
    side: z.enum(['Right', 'Left']),
    severity: z.enum(['Mild', 'Moderate', 'Severe']),
    date_of_injury: z.string().min(1, 'Date of Injury required'),
    mechanism_of_injury: z.string().min(1, 'Mechanism of Injury required'),
    symptoms: z.string().optional(),
    pain_score_0_to_10_rest: z.coerce.number().min(0).max(10),
    pain_score_0_to_10_movement: z.coerce.number().min(0).max(10),
    pain_type: z.string().min(1, 'Pain Type required'),
    functional_limitations_specific: z.string().optional(),
    imaging_results: z.string().optional(),
    diagnosis_details: z.string().min(1, 'Diagnosis Details required'),
    treatment_received_so_far: z.string().optional(),
});

export default function Step3InjuryDetails({ data, updateData, prevStep, nextStep }) {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            ...data.injury_details,
            symptoms: (data.injury_details.symptoms || []).join(', '),
            functional_limitations_specific: (data.injury_details.functional_limitations_specific || []).join(', '),
            treatment_received_so_far: (data.injury_details.treatment_received_so_far || []).join(', '),
        }

    });

    function onSubmit(formValues) {
        updateData('injury_details', {
            ...formValues,
            symptoms: formValues.symptoms?.split(',').map(s => s.trim()) || [],
            functional_limitations_specific: formValues.functional_limitations_specific?.split(',').map(s => s.trim()) || [],
            treatment_received_so_far: formValues.treatment_received_so_far?.split(',').map(s => s.trim()) || [],
        });

        nextStep();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="injury_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Injury Type</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Sprain" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="body_part"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Body Part</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Ankle" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="side"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Side</FormLabel>
                            <select {...field} className="w-full rounded p-2 border border-white/10 bg-transparent text-white">
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
                    name="severity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Severity</FormLabel>
                            <select {...field} className="w-full rounded p-2 border border-white/10 bg-transparent text-white">
                                <option value="">Select</option>
                                <option value="Mild">Mild</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Severe">Severe</option>
                            </select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date_of_injury"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date of Injury</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mechanism_of_injury"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mechanism of Injury</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Fall, collision" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Symptoms (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Swelling, Bruising" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pain_score_0_to_10_rest"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pain Score at Rest (0-10)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} min={0} max={10} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pain_score_0_to_10_movement"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pain Score at Movement (0-10)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} min={0} max={10} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pain_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pain Type</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Sharp, Dull" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="functional_limitations_specific"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Functional Limitations (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Difficulty walking" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imaging_results"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imaging Results</FormLabel>
                            <FormControl>
                                <Textarea placeholder="e.g. MRI findings" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="diagnosis_details"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Diagnosis Details</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Detailed diagnosis" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="treatment_received_so_far"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Treatment Received So Far (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Physical therapy, Medication" {...field} className="border border-white/10 bg-transparent text-white"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={prevStep} className="bg-gray-300 text-black">
                        Previous
                    </Button>
                    <Button type="submit" className=" bg-apts-purple-dark  hover:bg-apts-purple text-white ">Next</Button>
                </div>
            </form>
        </Form>
    );
}
