'use client';
import { useState } from 'react';
import DietPlanForm from './DietPlanForm';
import { Loader2 } from 'lucide-react';

export default function DietPlan() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await fetch('https://prajjwal1729-chatbot-api.hf.space/api/generate_diet/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      setResponseData(result.diet_plan); // Adjusted to match API format
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 flex flex-col items-center">
      {/* Diet Plan Form */}
      <DietPlanForm onSubmit={handleSubmit} />

      {/* Loading & Error Handling */}
      {loading && (
  <div className="flex items-center justify-center mt-4 text-white space-x-2">
    <Loader2 className="animate-spin w-6 h-6" />
    <p>Generating Diet Plan...</p>
  </div>
)}
      {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

      {responseData && (
        <div className="space-y-6">
          {/* Overview */}
           <div className="relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
          <div className='glass rounded-lg p-8 md:p-12 overflow-hidden'> 
          <h2 className="text-xl font-semibold text-lavender-300">🏀 Athlete Overview</h2>
          <p className="mt-2 text-white">
           <strong className='text-lavender-200'>Sport:</strong> {responseData.overview.sport} <br />
           <strong className='text-lavender-200'>Position:</strong> {responseData.overview.position} <br />
          <strong className='text-lavender-200'>Age:</strong> {responseData.overview.age} <br />
          <strong className='text-lavender-200'>Weight:</strong> {responseData.overview.weight} kg <br />
          <strong className='text-lavender-200'>Height:</strong> {responseData.overview.height} cm <br />
          <strong className='text-lavender-200'>Goal:</strong> {responseData.overview.goal}
          </p>
        </div>
        </div>


          {/* Meal Plan */}
          <div className="relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
          <div className='glass rounded-lg p-8 md:p-12 overflow-hidden'> 
           <h3 className="text-lg font-semibold text-lavender-300">🍴 Meal Plan</h3>
            {Object.entries(responseData.meal_plan).map(([meal, items]) => (
              <div key={meal} className="mt-3">
                <h4 className="text-md font-semibold text-lavender-200 capitalize">{meal}</h4>
                <ul className="list-disc pl-5 text-white">
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </div>

          {/* Macronutrient Breakdown */}
          <div className="relative glass-dark animate-fade-in rounded-lg shadow border border-[#72FF72]/60">
  <div className="absolute inset-0 bg-gradient-to-r from-[#1F3B08] via-[#72FF72] to-[#D4A5FF] opacity-10 blur-3xl -z-10 rounded-lg"></div>
  <div className='glass rounded-lg p-8 md:p-12 overflow-hidden'>
           <h2 className="text-xl font-semibold text-lavender-300 ">💪 Macronutrients</h2>
            <p className="mt-2 text-lavender-100">
              <strong>Protein:</strong> {responseData.macronutrients.protein} <br />
              <strong>Carbs:</strong> {responseData.macronutrients.carbs} <br />
              <strong>Fats:</strong> {responseData.macronutrients.fats}
            </p>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
