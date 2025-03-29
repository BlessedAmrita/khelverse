'use client';

import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import CareerAdviceForm from './CareerAdviceForm';
import FeatureHero from '../shared/FeatureHero';

export default function CareerAdviceResult() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await fetch('https://satyam075-chatbot-ai.hf.space/career/generate_career_advice/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      setResponseData(result.career_guidance); // Adjusted to match API format
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <FeatureHero
        bg_url={
          'https://res.cloudinary.com/dpmlrxlzr/image/upload/v1741329876/MacBook_Pro_16__-_1_3_rdftkl.svg'
        }
        title={'Diet Plan'}
      />
      <div className="w-full mx-auto p-6 space-y-6 flex flex-col items-center">
        {/* Career Advice Form */}
        <CareerAdviceForm onSubmit={handleSubmit} />

        {/* Loading & Error Handling */}
        {loading && <p className="text-center mt-4 text-blue-500">🔄 Generating Career Plan...</p>}
        {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

        {responseData && (
          <div className="space-y-6 w-full">
            {/* Display Career Paths */}
            {responseData.map((advice, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-black">{advice.career_path}</h3>
                <p className="mt-2 text-gray-600">{advice.why_fits}</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {advice.roadmap.map((step, i) => (
                    <div
                      key={i}
                      className="p-4 bg-lavender text-white rounded-lg shadow hover:bg-black hover:text-lavender transition-all duration-500"
                    >
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                      <p className="mt-2">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
