"use client";

import { useState } from "react";
import InjuryAssessmentForm from "./InjuryAssessmentForm";
import { Loader2 } from "lucide-react";

export default function InjuryAssessment() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const response = await fetch("https://prajjwal1729-chatbot-api.hf.space/injury/analyze_injury/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong");

      setResponseData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 flex flex-col items-center">
      {/* Injury Form */}
      <InjuryAssessmentForm onSubmit={handleSubmit} />

      {/* Loading & Error Handling */}
      {loading && (
  <div className="flex items-center justify-center mt-4 text-white space-x-2">
    <Loader2 className="animate-spin w-6 h-6" />
    <p>Generating Recovery Plan...</p>
  </div>
)}
      {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

      {responseData && (
        <>
          {/* 🔹 Starting Content */}
          <div className="relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
          <div className='glass rounded-lg p-8 md:p-12 overflow-hidden'> 
           <h2 className="text-xl font-semibold text-lavender-200">🩺 {responseData.starting_content.title}</h2>
            <p className="mt-2 text-white">{responseData.starting_content.disclaimer}</p>
          </div>
          </div>

          {/* 🔹 Recovery Phases (2x2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(responseData.rehabilitation_plan).map((phase, index) => (
              <div key={index} className="relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
             <div className='glass rounded-lg p-8 md:p-12 overflow-hidden h-full'> 
           
                <h3 className="text-lg font-semibold text-lavender-200">{phase.title}</h3>
                <ul className="mt-2 text-white list-disc pl-5">
                  {phase.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
                <p className="mt-2 text-white"><strong>Progression Criteria:</strong> {phase.progression_criteria}</p>
              </div>
              </div>
            ))}
          </div>

          {/* 🔹 Estimated Recovery Time */}
          <div className="relative glass-dark animate-fade-in rounded-lg shadow border border-lavender/60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-10 blur-3xl -z-10 rounded-lg"></div>
          <div className='glass rounded-lg p-8 md:p-12 overflow-hidden'> 
           <h2 className="text-xl font-semibold text-lavender-200">⏳ Estimated Recovery Time</h2>
            <ul className="mt-2 text-white list-disc pl-5">
              {Object.entries(responseData.estimated_recovery_time).map(([key, value]) => (
                <li key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value}</li>
              ))}
            </ul>
          </div>
          </div>

          {/* 🔹 Diet & Supplements */}
          <div className="relative glass-dark animate-fade-in rounded-lg shadow border border-[#72FF72]/60">
  <div className="absolute inset-0 bg-gradient-to-r from-[#1F3B08] via-[#72FF72] to-[#D4A5FF] opacity-10 blur-3xl -z-10 rounded-lg"></div>
  <div className='glass rounded-lg p-8 md:p-12 overflow-hidden'>
            <h2 className="text-xl font-semibold text-green-500">🥗 Diet & Supplements</h2>
            <ul className="mt-2 text-white list-disc pl-5">
              <li><strong>Protein:</strong> {responseData.diet_supplements.protein}</li>
              <li><strong>Hydration:</strong> {responseData.diet_supplements.hydration}</li>
              <li><strong>Anti-inflammatory:</strong> {responseData.diet_supplements.anti_inflammatory.join(", ")}</li>
              {Object.entries(responseData.diet_supplements.vitamins).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
            </div>
          </div>

          {/* 🔹 Precautions */}
          <div className="relative glass-dark animate-fade-in rounded-lg shadow border border-[#FFD700]/60">
  <div className="absolute inset-0 bg-gradient-to-r from-[#4A3F10] via-[#FFD700] to-[#FFF4B0] opacity-15 blur-3xl -z-10 rounded-lg"></div>
  <div className='glass rounded-lg p-8 md:p-12 overflow-hidden'>
            <h2 className="text-xl font-semibold text-yellow-600">⚠️ Precautions</h2>
            <ul className="mt-2 text-white list-disc pl-5">
              {Object.entries(responseData.precautions).map(([key, value]) => (
                <li key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value}</li>
              ))}
            </ul>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
