'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleDownload } from '@/utils/downloadPdf';
import { Loader2 } from 'lucide-react';

export default function Step4ReviewAndResult({ data, result, prevStep, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  const renderArray = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? (
      <ul className="list-disc list-inside ml-4 space-y-1">
        {arr.map((item, i) => (
          <li key={i} className="text-lavender-200">
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </li>
        ))}
      </ul>
    ) : (
      <p className="italic text-lavender-400">None</p>
    );

  return (
    <div className="space-y-8 p-6 rounded-lg glass-dark shadow-lg border border-lavender/50 relative print:p-0 print:shadow-none print:border-none print:space-y-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-dark via-purple to-purple-light opacity-20 blur-3xl -z-10 rounded-lg print:hidden"></div>

      {!result && (
        <>
          <p className="text-yellow-400 font-medium text-center">
            Click Submit to generate the injury assessment report.
          </p>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep} className="bg-gray-300 text-black">
              ← Previous
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-apts-purple-dark  hover:bg-apts-purple text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-4 h-4" /> Generating...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </>
      )}

      {result && (
        <>
          <h2 className="text-2xl font-semibold text-lavender-200 mt-8 mb-4 flex items-center gap-2 print:mt-0 font-sprintura">
            🩺 Injury Assessment Report
          </h2>

          <div
            ref={resultRef}
            className="space-y-6 p-6 rounded-lg text-lavender-200 print:max-h-none print:overflow-visible print:p-0 print:bg-white print:text-black print:border-none"
          >
            <p>
              <strong>Report Title:</strong> {result.report_title || 'N/A'}
            </p>
            <p>
              <strong>Generated For Athlete:</strong> {result.report_generated_for_athlete_id || 'N/A'}
            </p>
            <p>
              <strong>Generated At:</strong>{' '}
              {result.generation_timestamp
                ? new Date(result.generation_timestamp).toLocaleString()
                : 'N/A'}
            </p>

            {/* Sections */}
            <section>
              <h3 className="font-semibold text-lg mt-4 border-b border-lavender/40 pb-1">
                Athlete Injury Summary
              </h3>
              <p><strong>Injury Synopsis:</strong> {result.athlete_injury_summary?.injury_synopsis || 'N/A'}</p>
              <p><strong>Impact On Sport Performance:</strong> {result.athlete_injury_summary?.impact_on_sport_performance || 'N/A'}</p>
              <p><strong>Key Recovery Influencers:</strong></p>
              {renderArray(result.athlete_injury_summary?.key_recovery_influencers)}
              <p><strong>Estimated Recovery Timeline Summary:</strong> {result.athlete_injury_summary?.estimated_recovery_timeline_summary || 'N/A'}</p>
            </section>

            {/* Rehab Phases */}
            <section>
              <h3 className="font-semibold text-lg mt-6 border-b border-lavender/40 pb-1">
                Rehabilitation Phases
              </h3>
              {Array.isArray(result.rehabilitation_phases) && result.rehabilitation_phases.length > 0 ? (
                result.rehabilitation_phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="border rounded p-4 my-3 bg-purple-950/20 border-lavender/50 shadow-inner"
                  >
                    <p className="font-semibold text-purple-300">
                      Phase {phase.phase_number}: {phase.phase_name || 'N/A'}
                    </p>
                    <p><strong>Primary Goals:</strong></p>
                    {renderArray(phase.primary_goals)}
                    <p><strong>Estimated Duration:</strong> {phase.estimated_duration || 'N/A'}</p>
                    <p><strong>Pain & Inflammation Management:</strong></p>
                    {renderArray(phase.pain_inflammation_management)}

                    {[
                      'rom_flexibility_exercises',
                      'strengthening_exercises',
                      'neuro_control_proprio_balance_exercises',
                      'cardio_conditioning',
                      'sport_specific_drills',
                    ].map((exerciseKey) => (
                      <div key={exerciseKey} className="mt-3">
                        <p className="underline capitalize text-purple-400 mb-1">
                          {exerciseKey.replace(/_/g, ' ')}:
                        </p>
                        {Array.isArray(phase[exerciseKey]) && phase[exerciseKey].length > 0 ? (
                          phase[exerciseKey].map((ex, i) => (
                            <div
                              key={i}
                              className=" p-3 mb-2 rounded bg-black/20 text-lavender-100 shadow-md"
                            >
                              <p><strong>Name:</strong> {ex.exercise_name || 'N/A'}</p>
                              <p><strong>Description:</strong> {ex.description || 'N/A'}</p>
                              <p><strong>Parameters:</strong> {ex.parameters || 'N/A'}</p>
                              <p><strong>Rationale:</strong> {ex.rationale || 'N/A'}</p>
                              <p><strong>Sport Relevance:</strong> {ex.sport_relevance || 'N/A'}</p>
                            </div>
                          ))
                        ) : (
                          <p className="italic text-lavender-400">None</p>
                        )}
                      </div>
                    ))}

                    <p><strong>Precautions & Contraindications:</strong></p>
                    {renderArray(phase.precautions_contraindications)}
                    <p><strong>Criteria for Progression:</strong></p>
                    {renderArray(phase.criteria_for_progression)}
                  </div>
                ))
              ) : (
                <p className="italic text-lavender-400">None</p>
              )}
            </section>

            {/* Other Sections */}
            <section>
              <h3 className="font-semibold text-lg mt-6 border-b border-lavender/40 pb-1">
                Sport Specific Return Strategy
              </h3>
              <p><strong>Final Functional Tests:</strong></p>
              {renderArray(result.sport_specific_return_strategy?.final_functional_tests)}
              <p><strong>Graduated Return to Training Plan Summary:</strong> {result.sport_specific_return_strategy?.graduated_return_to_training_plan_summary || 'N/A'}</p>
              <p><strong>Preventing Reinjury Considerations:</strong></p>
              {renderArray(result.sport_specific_return_strategy?.preventing_reinjury_considerations)}
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-6 border-b border-lavender/40 pb-1">
                Nutritional Guidance
              </h3>
              <p><strong>Caloric Intake Adjustment Notes:</strong> {result.nutritional_guidance?.caloric_intake_adjustment_notes || 'N/A'}</p>
              <p><strong>Macronutrient Targets Summary:</strong> {result.nutritional_guidance?.macronutrient_targets_summary || 'N/A'}</p>
              <p><strong>Key Micronutrients & Supplements:</strong></p>
              {renderArray(result.nutritional_guidance?.key_micronutrients_supplements)}
              <p><strong>Hydration Strategy:</strong> {result.nutritional_guidance?.hydration_strategy || 'N/A'}</p>
              <p><strong>Dietary Preferences Notes:</strong> {result.nutritional_guidance?.dietary_preferences_notes || 'N/A'}</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-6 border-b border-lavender/40 pb-1">
                Psychological Support
              </h3>
              <p><strong>Coping Strategies:</strong></p>
              {renderArray(result.psychological_support?.coping_strategies)}
              <p><strong>Goal Setting Advice:</strong> {result.psychological_support?.goal_setting_advice || 'N/A'}</p>
              <p><strong>Maintaining Connection to Sport:</strong> {result.psychological_support?.maintaining_connection_sport || 'N/A'}</p>
              <p><strong>Importance of Sleep:</strong> {result.psychological_support?.importance_of_sleep || 'N/A'}</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-6 border-b border-lavender/40 pb-1">
                Monitoring and Red Flags
              </h3>
              <p><strong>Self Monitoring Techniques:</strong></p>
              {renderArray(result.monitoring_and_red_flags?.self_monitoring_techniques)}
              <p><strong>Critical Red Flags:</strong></p>
              {renderArray(result.monitoring_and_red_flags?.critical_red_flags)}
            </section>

            <section>
              <h3 className="font-semibold text-lg mt-6 text-red-400 border-b border-red-400 pb-1 print:text-red-600 print:border-red-600">
                Disclaimer
              </h3>
              <p>{result.disclaimer || 'N/A'}</p>
            </section>
          </div>

          <div className="flex justify-between mt-6 print:hidden">
            <Button variant="outline" onClick={prevStep} className="bg-gray-300 text-black">
              ← Previous
            </Button>
            <button
              onClick={() => handleDownload(resultRef)}
              className="bg-apts-purple-dark  hover:bg-apts-purple text-white rounded-lg px-2"
              aria-label="Download report as PDF"
              title="Download report as PDF"
            >
              📄 Download as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
