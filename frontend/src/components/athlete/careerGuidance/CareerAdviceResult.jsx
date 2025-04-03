'use client';

import { useState } from 'react';
import CareerAdviceForm from './CareerAdviceForm';
import FeatureHero from '../../shared/FeatureHero';

export default function CareerAdviceResult() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
        const response = await fetch('https://prajjwal1729-chatbot-api.hf.space/career/generate_career_advice/', {
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
        title={'Career Advice Form'}
      />
      <div className="w-full mx-auto p-6 space-y-6 flex flex-col items-center">
        {/* Career Advice Form */}
        <CareerAdviceForm onSubmit={handleSubmit} />

        {/* Loading & Error Handling */}
        {loading && (
  <div className="flex items-center justify-center mt-4 text-white space-x-2">
    <Loader2 className="animate-spin w-6 h-6" />
    <p>Generating Career Plan...</p>
  </div>
)}
        {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

        {responseData && (
          <div className="space-y-6 w-full">
            {/* Display Career Paths */}
            {responseData.map((advice, index) => (
              <div key={index} className="p-6 bg-apts-lightdark text-white rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-lavender-400">{advice.career_path}</h3>
                <p className="mt-2 text-lavender-100">{advice.why_fits}</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {advice.roadmap.map((step, i) => (
                    <div
                      key={i}
                      className=" relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
                          <div className='glass rounded-lg p-8 md:p-12 overflow-hidden h-full'>
                      <h4 className="font-semibold text-lg text-lavender-200">{step.title}</h4>
                      <p className="mt-2">{step.description}</p>
                    </div>
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
