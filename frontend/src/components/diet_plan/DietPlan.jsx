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
      const response = await fetch('https://satyam075-chatbot-ai.hf.space/api/generate_diet/', {
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
      {loading && <p className="text-center mt-4 text-blue-500">🔄 Generating Diet Plan...</p>}
      {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

      {responseData && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800">🏀 Athlete Overview</h2>
            <p className="mt-2 text-gray-600">
              <strong>Sport:</strong> {responseData.overview.sport} <br />
              <strong>Position:</strong> {responseData.overview.position} <br />
              <strong>Age:</strong> {responseData.overview.age} <br />
              <strong>Weight:</strong> {responseData.overview.weight} kg <br />
              <strong>Height:</strong> {responseData.overview.height} cm <br />
              <strong>Goal:</strong> {responseData.overview.goal}
            </p>
          </div>

          {/* Meal Plan */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">🍴 Meal Plan</h3>
            {Object.entries(responseData.meal_plan).map(([meal, items]) => (
              <div key={meal} className="mt-3">
                <h4 className="text-md font-semibold text-gray-700 capitalize">{meal}</h4>
                <ul className="list-disc pl-5 text-gray-600">
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Macronutrient Breakdown */}
          <div className="p-6 bg-green-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-900">💪 Macronutrients</h2>
            <p className="mt-2 text-green-700">
              <strong>Protein:</strong> {responseData.macronutrients.protein} <br />
              <strong>Carbs:</strong> {responseData.macronutrients.carbs} <br />
              <strong>Fats:</strong> {responseData.macronutrients.fats}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
