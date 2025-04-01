"use client";

import { useState } from "react";
import InjuryAssessmentForm from "./InjuryAssessmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      const response = await fetch("http://127.0.0.1:8000/injury/analyze_injury/", {
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
      {loading && <p className="text-center mt-4 text-blue-500">🔄 Generating Recovery Plan...</p>}
      {error && <p className="text-center mt-4 text-red-500">❌ {error}</p>}

      {responseData && (
        <>
          {/* 🔹 Starting Content */}
          <div className="w-full p-6 bg-gray-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800">🩺 {responseData.starting_content.title}</h2>
            <p className="mt-2 text-gray-600">{responseData.starting_content.disclaimer}</p>
          </div>

          {/* 🔹 Recovery Phases (2x2 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(responseData.rehabilitation_plan).map((phase, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md border">
                <h3 className="text-lg font-semibold text-gray-800">{phase.title}</h3>
                <ul className="mt-2 text-gray-600 list-disc pl-5">
                  {phase.goals.map((goal, i) => (
                    <li key={i}>{goal}</li>
                  ))}
                </ul>
                <p className="mt-2 text-gray-600"><strong>Progression Criteria:</strong> {phase.progression_criteria}</p>
              </div>
            ))}
          </div>

          {/* 🔹 Estimated Recovery Time */}
          <div className="w-full p-6 bg-blue-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-900">⏳ Estimated Recovery Time</h2>
            <ul className="mt-2 text-blue-700 list-disc pl-5">
              {Object.entries(responseData.estimated_recovery_time).map(([key, value]) => (
                <li key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value}</li>
              ))}
            </ul>
          </div>

          {/* 🔹 Diet & Supplements */}
          <div className="w-full p-6 bg-green-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-green-900">🥗 Diet & Supplements</h2>
            <ul className="mt-2 text-green-700 list-disc pl-5">
              <li><strong>Protein:</strong> {responseData.diet_supplements.protein}</li>
              <li><strong>Hydration:</strong> {responseData.diet_supplements.hydration}</li>
              <li><strong>Anti-inflammatory:</strong> {responseData.diet_supplements.anti_inflammatory.join(", ")}</li>
              {Object.entries(responseData.diet_supplements.vitamins).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          </div>

          {/* 🔹 Precautions */}
          <div className="w-full p-6 bg-yellow-100 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-yellow-900">⚠️ Precautions</h2>
            <ul className="mt-2 text-yellow-700 list-disc pl-5">
              {Object.entries(responseData.precautions).map(([key, value]) => (
                <li key={key}><strong>{key.replace(/_/g, " ")}:</strong> {value}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
