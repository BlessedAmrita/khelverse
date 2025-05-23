'use client';

import { useState } from 'react';
import Step1AthleteData from './Step1AthleteData';
import Step2AthleteAdditional from './Step2AthleteAdditional';
import Step3InjuryDetails from './Step3InjuryDetails';
import Step4ReviewAndResult from './Step4ReviewAndResult';
import { toast } from 'react-hot-toast';

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      athlete_data: {
        athlete_id: '',
        age: '',
        height_cm: '',
        weight_kg: '',
        sport: '',
        role_in_sport: '',
        dominant_side: '',
        activity_level: '',
        years_experience_sport: '',
        training_volume_hours_per_week: '',
        previous_injuries: [],
        medical_conditions: [],
        specific_goals_recovery: '',
        access_to_facilities: [],
        psychological_factors: [],
        current_medications_supplements: [],
        dietary_preferences_restrictions: [],
      },
      injury_details: {
        injury_type: '',
        body_part: '',
        side: '',
        severity: '',
        date_of_injury: '',
        mechanism_of_injury: '',
        symptoms: [],
        pain_score_0_to_10_rest: '',
        pain_score_0_to_10_movement: '',
        pain_type: '',
        functional_limitations_specific: [],
        imaging_results: '',
        diagnosis_details: '',
        treatment_received_so_far: [],
      },
    });
  const [result, setResult] = useState(null);  // NEW: to store API response

  function updateFormData(section, data) {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  }

  function nextStep() {
    setStep(prev => Math.min(prev + 1, 4));
  }

  function prevStep() {
    setStep(prev => Math.max(prev - 1, 1));
  }

  async function submitToAPI() {
    try {
      const response = await fetch('https://pjxcharya-injury-recovery.hf.space/detailed-injury-recovery/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      const responseData = await response.json();
      setResult(responseData); // Save API response

      toast.success('Form submitted successfully!');
      // Instead of resetting form, go to step 4 to show result
      setStep(4);
    } catch (error) {
      toast.error(error.message || 'Submission failed');
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-apts-dark text-white rounded-lg">
      {step === 1 && (
        <Step1AthleteData data={formData} updateData={updateFormData} nextStep={nextStep} />
      )}
      {step === 2 && (
        <Step2AthleteAdditional data={formData}  updateData={updateFormData} prevStep={prevStep} nextStep={nextStep} />
      )}
      {step === 3 && (
        <Step3InjuryDetails data={formData}  updateData={updateFormData} prevStep={prevStep} nextStep={nextStep} />
      )}
      {step === 4 && (
        <Step4ReviewAndResult
          data={formData} 
          result={result}
          prevStep={prevStep}
          onSubmit={submitToAPI}
        />
      )}
    </div>
  );
}
