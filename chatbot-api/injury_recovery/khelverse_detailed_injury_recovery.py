import fastapi
import pydantic # Used explicitly for BaseModel, Field, ValidationError
import datetime
import google.generativeai as genai
import os
import json
import asyncio # For running blocking calls in async FastAPI
import logging # Added for better logging

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Pydantic Models for Detailed Input ---

class AthleteDataDetailed(pydantic.BaseModel):
    athlete_id: str = pydantic.Field(..., example="ATHJ007")
    age: int = pydantic.Field(..., gt=0, example=26)
    height_cm: float = pydantic.Field(..., gt=0, example=178.0)
    weight_kg: float = pydantic.Field(..., gt=0, example=75.0)
    sport: str = pydantic.Field(..., example="Cricket")
    role_in_sport: str | None = pydantic.Field(None, example="Fast Bowler")
    dominant_side: str | None = pydantic.Field(None, example="Right")
    activity_level: str = pydantic.Field(..., example="Professional")
    years_experience_sport: int | None = pydantic.Field(None, example=8)
    training_volume_hours_per_week: float | None = pydantic.Field(None, example=15.0)
    previous_injuries: list[str] | None = pydantic.Field(None, example=["Left Ankle Sprain (2022, Grade 2, full recovery)"])
    medical_conditions: list[str] | None = pydantic.Field(None, example=["Well-controlled Asthma"])
    specific_goals_recovery: str | None = pydantic.Field(None, example="Return to competitive play for the upcoming national league in 4 months.")
    access_to_facilities: list[str] | None = pydantic.Field(None, example=["Fully equipped gym", "Access to physiotherapy clinic twice a week"])
    psychological_factors: list[str] | None = pydantic.Field(None, example=["Highly motivated", "Some anxiety about re-injury"])
    current_medications_supplements: list[str] | None = pydantic.Field(None, example=["Salbutamol inhaler (as needed)", "Multivitamin", "Whey protein"])
    dietary_preferences_restrictions: list[str] | None = pydantic.Field(None, example=["Lacto-vegetarian", "No shellfish allergy"])

class InjuryDetailsDetailed(pydantic.BaseModel):
    injury_type: str = pydantic.Field(..., example="Rotator Cuff Tendinopathy") # For pre-diagnosis, this might be "Suspected Knee Sprain" or symptom based
    body_part: str = pydantic.Field(..., example="Right Shoulder")
    side: str | None = pydantic.Field(None, example="Right")
    severity: str = pydantic.Field(..., example="Moderate") # For pre-diagnosis, could be "High pain, unable to bear weight"
    date_of_injury: datetime.date = pydantic.Field(..., example=datetime.date.today() - datetime.timedelta(days=30))
    mechanism_of_injury: str | None = pydantic.Field(None, example="Gradual onset over 2 months, aggravated by overhead bowling action.")
    symptoms: list[str] = pydantic.Field(..., example=["Pain with overhead movements", "Dull ache at rest"])
    pain_score_0_to_10_rest: int | None = pydantic.Field(None, ge=0, le=10, example=3)
    pain_score_0_to_10_movement: int | None = pydantic.Field(None, ge=0, le=10, example=7)
    pain_type: str | None = pydantic.Field(None, example="Dull ache, occasional sharp twinges")
    functional_limitations_specific: list[str] | None = pydantic.Field(None, example=["Difficulty reaching high shelf"])
    imaging_results: str | None = pydantic.Field(None, example="Ultrasound showed supraspinatus tendinopathy.") # Will be None for pre-diagnosis
    diagnosis_details: str | None = pydantic.Field(None, example="Confirmed by sports physician.") # Will be None for pre-diagnosis
    treatment_received_so_far: list[str] | None = pydantic.Field(None, example=["Rest, Ice"]) # Will be None or empty for new injury

class InjuryRecoveryDetailedRequest(pydantic.BaseModel):
    athlete_data: AthleteDataDetailed
    injury_details: InjuryDetailsDetailed

# --- Pydantic Models for Structured Detailed Output ---

class ReportAthleteInjurySummary(pydantic.BaseModel):
    injury_synopsis: str
    impact_on_sport_performance: str
    key_recovery_influencers: list[str]
    estimated_recovery_timeline_summary: str

class ExerciseDetail(pydantic.BaseModel):
    exercise_name: str
    description: str | None = None
    parameters: str
    rationale: str | None = None
    sport_relevance: str | None = None

class RehabilitationPhase(pydantic.BaseModel):
    phase_number: int
    phase_name: str
    primary_goals: list[str]
    estimated_duration: str
    pain_inflammation_management: list[str]
    rom_flexibility_exercises: list[ExerciseDetail]
    strengthening_exercises: list[ExerciseDetail]
    neuro_control_proprio_balance_exercises: list[ExerciseDetail]
    cardio_conditioning: list[ExerciseDetail]
    sport_specific_drills: list[ExerciseDetail] | None = None
    precautions_contraindications: list[str]
    criteria_for_progression: list[str]

class SportSpecificReturnStrategy(pydantic.BaseModel):
    final_functional_tests: list[str]
    graduated_return_to_training_plan_summary: str
    preventing_reinjury_considerations: list[str]

class NutritionalGuidanceDetail(pydantic.BaseModel):
    caloric_intake_adjustment_notes: str
    macronutrient_targets_summary: str
    key_micronutrients_supplements: list[str]
    hydration_strategy: str
    dietary_preferences_notes: str | None = None

class PsychologicalSupportDetail(pydantic.BaseModel):
    coping_strategies: list[str]
    goal_setting_advice: str
    maintaining_connection_sport: str
    importance_of_sleep: str

class MonitoringAndRedFlags(pydantic.BaseModel):
    self_monitoring_techniques: list[str]
    critical_red_flags: list[str]

class DetailedRecoveryReportResponse(pydantic.BaseModel):
    report_generated_for_athlete_id: str
    report_title: str
    generation_timestamp: datetime.datetime = pydantic.Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc))
    athlete_injury_summary: ReportAthleteInjurySummary
    rehabilitation_phases: list[RehabilitationPhase]
    sport_specific_return_strategy: SportSpecificReturnStrategy
    nutritional_guidance: NutritionalGuidanceDetail
    psychological_support: PsychologicalSupportDetail
    monitoring_and_red_flags: MonitoringAndRedFlags
    disclaimer: str = pydantic.Field(
        default="This AI-generated recovery plan is for informational purposes ONLY and does NOT substitute professional medical diagnosis, treatment, or advice from a qualified physician, physiotherapist, or other healthcare provider. Always consult with such professionals before starting or modifying any exercise or rehabilitation program, or if you have concerns about an injury. KhelVerse and its AI model are not liable for any decisions or actions taken based on this information. If you are experiencing a medical emergency, please seek immediate medical attention."
    )

# --- FastAPI App Initialization ---
app = fastapi.FastAPI(
    title="KhelVerse Detailed Injury Recovery AI",
    description="Provides AI-driven, highly personalized injury recovery reports and initial injury management advice for Indian athletes.",
    version="2.3.0" # Incremented version for logging and API key improvements
)

# --- Data Transformation Function ---
def transform_ai_data_to_pydantic(ai_data: dict, sport_name: str) -> dict:
    """
    Transforms the AI-generated dictionary to match Pydantic models.
    This function attempts to bridge discrepancies between AI output and expected schema.
    It will likely need ongoing refinement based on observed AI responses.
    """
    transformed_data = ai_data.copy() # Work on a copy

    # Athlete Injury Summary transformations
    summary_data = transformed_data.get('athlete_injury_summary', {})
    if isinstance(summary_data, dict):
        if 'estimated_recovery_timeline' in summary_data:
            summary_data['estimated_recovery_timeline_summary'] = summary_data.pop('estimated_recovery_timeline')
        transformed_data['athlete_injury_summary'] = summary_data

    # Rehabilitation Phases transformations
    phases_data = transformed_data.get('rehabilitation_phases', [])
    if isinstance(phases_data, list):
        for phase in phases_data:
            if isinstance(phase, dict):
                if 'pain_and_inflammation_management' in phase:
                    phase['pain_inflammation_management'] = phase.pop('pain_and_inflammation_management')
                if 'neuromuscular_control_proprioception_balance_exercises' in phase:
                    phase['neuro_control_proprio_balance_exercises'] = phase.pop('neuromuscular_control_proprioception_balance_exercises')

                # Transform cardio_conditioning items
                if 'cardiovascular_conditioning' in phase and isinstance(phase['cardiovascular_conditioning'], list):
                    new_cardio_list = []
                    for item_raw in phase['cardiovascular_conditioning']:
                        if isinstance(item_raw, dict):
                            new_item = {
                                "exercise_name": item_raw.get("exercise_name") or item_raw.get("modality", "Cardio Activity"),
                                "description": item_raw.get("description"),
                                "parameters": item_raw.get("parameters", "As prescribed"),
                                "rationale": item_raw.get("rationale"),
                                "sport_relevance": item_raw.get("sport_relevance")
                            }
                            new_cardio_list.append(new_item)
                        elif isinstance(item_raw, str): # Handle if AI gives just a string
                             new_cardio_list.append({"exercise_name": item_raw, "parameters": "As prescribed"})
                    phase['cardio_conditioning'] = new_cardio_list
                
                # Transform sport_specific_drills
                ai_sport_drill_key_options = [
                    f"introduction_to_{sport_name.lower()}_specific_drills",
                    "introduction_to_sport_specific_drills",
                    "sport_specific_drills" # Added a more direct key
                ]
                raw_drills = None
                for key_option in ai_sport_drill_key_options:
                    if key_option in phase:
                        raw_drills = phase.pop(key_option)
                        break
                
                transformed_drills = []
                if isinstance(raw_drills, list):
                    for drill_raw in raw_drills:
                        if isinstance(drill_raw, dict):
                            transformed_drills.append({
                                "exercise_name": drill_raw.get("exercise_name") or drill_raw.get("drill_name", "Sport Drill"),
                                "description": drill_raw.get("description"),
                                "parameters": drill_raw.get("parameters", "As per plan"),
                                "rationale": drill_raw.get("rationale"),
                                "sport_relevance": drill_raw.get("sport_relevance")
                            })
                        elif isinstance(drill_raw, str): # Handle if AI gives just a string
                            transformed_drills.append({"exercise_name": drill_raw, "parameters": "As per plan"})
                
                # Ensure it's None if empty and model expects None, otherwise empty list if model expects list
                is_optional_none = RehabilitationPhase.model_fields['sport_specific_drills'].is_required() is False and \
                                   RehabilitationPhase.model_fields['sport_specific_drills'].default is None
                
                if transformed_drills:
                    phase['sport_specific_drills'] = transformed_drills
                elif is_optional_none : # If field is Optional[list[...]] = None
                    phase['sport_specific_drills'] = None
                else: # If field is list[...] or Optional[list[...]] = Field(default_factory=list)
                    phase['sport_specific_drills'] = []


    # Sport Specific Return Strategy transformations
    strategy_data = transformed_data.get('sport_specific_return_strategy', {})
    if isinstance(strategy_data, dict):
        if 'final_functional_testing_battery' in strategy_data:
            strategy_data['final_functional_tests'] = strategy_data.pop('final_functional_testing_battery')
        if 'graduated_return_to_training_plan' in strategy_data:
            strategy_data['graduated_return_to_training_plan_summary'] = strategy_data.pop('graduated_return_to_training_plan')
        
        ai_reinjury_key_options = [
            f"considerations_for_preventing_re_injury_in_{sport_name.lower()}",
            "considerations_for_preventing_reinjury",
            "preventing_reinjury_considerations" # More direct key
        ]
        for key_option in ai_reinjury_key_options:
            if key_option in strategy_data:
                strategy_data['preventing_reinjury_considerations'] = strategy_data.pop(key_option)
                break
        transformed_data['sport_specific_return_strategy'] = strategy_data

    # Nutritional Guidance transformations
    nutrition_data = transformed_data.get('nutritional_guidance', {})
    if isinstance(nutrition_data, dict):
        if 'caloric_intake_adjustment' in nutrition_data:
            nutrition_data['caloric_intake_adjustment_notes'] = nutrition_data.pop('caloric_intake_adjustment')
        
        if 'macronutrient_targets' in nutrition_data and isinstance(nutrition_data['macronutrient_targets'], dict):
            macro_summary_parts = [f"{key.capitalize()}: {value}" for key, value in nutrition_data['macronutrient_targets'].items()]
            nutrition_data['macronutrient_targets_summary'] = ". ".join(macro_summary_parts)
            # nutrition_data.pop('macronutrient_targets') # Decide if you want to keep original
        elif isinstance(nutrition_data.get('macronutrient_targets'), str):
            nutrition_data['macronutrient_targets_summary'] = nutrition_data['macronutrient_targets']
        
        if 'addressing_preferences_restrictions' in nutrition_data:
            nutrition_data['dietary_preferences_notes'] = nutrition_data.pop('addressing_preferences_restrictions')
        transformed_data['nutritional_guidance'] = nutrition_data

    # Psychological Support transformations
    psych_data = transformed_data.get('psychological_support', {})
    if isinstance(psych_data, dict):
        if 'goal_setting' in psych_data:
            psych_data['goal_setting_advice'] = psych_data.pop('goal_setting')
        if 'maintaining_connection' in psych_data:
            psych_data['maintaining_connection_sport'] = psych_data.pop('maintaining_connection')
        transformed_data['psychological_support'] = psych_data
            
    # Ensure some top-level default fields are present if Pydantic expects them and AI might omit
    transformed_data.setdefault('report_generated_for_athlete_id', 'N/A')
    transformed_data.setdefault('report_title', 'AI Generated Injury Recovery Plan')
    transformed_data.setdefault('generation_timestamp', datetime.datetime.now(datetime.timezone.utc).isoformat())
    transformed_data.setdefault('disclaimer', DetailedRecoveryReportResponse.model_fields['disclaimer'].default)

    return transformed_data

# --- AI Model Interaction ---
# Define the model name as a constant for easy updates
GEMINI_MODEL_NAME = "gemini-1.5-flash-latest" # Using a current model

async def get_ai_detailed_recovery_plan(
    athlete_data: AthleteDataDetailed,
    injury_details: InjuryDetailsDetailed
) -> DetailedRecoveryReportResponse:

    bmi_str = "Not specified"
    if athlete_data.height_cm and athlete_data.weight_kg:
        height_m = athlete_data.height_cm / 100
        if height_m > 0:
            bmi = round(athlete_data.weight_kg / (height_m * height_m), 1)
            bmi_str = f"{bmi} kg/m^2"

    def format_list(data_list: list[str] | None) -> str:
        return ', '.join(data_list) if data_list else 'None specified'

    is_pre_diagnosis = not injury_details.diagnosis_details and not injury_details.imaging_results

    pre_diagnosis_instructions = ""
    if is_pre_diagnosis:
        pre_diagnosis_instructions = """
**IMPORTANT CONTEXT: PRE-DIAGNOSIS SCENARIO**
The athlete has reported symptoms of a new injury but does NOT yet have a formal medical diagnosis, imaging results, or a professional treatment plan. 
Therefore, this plan MUST focus on:
1.  **Initial Injury Management Advice:** Based on the reported symptoms and suspected injury type (if athlete provides one), recommend general acute care (e.g., PRICE/POLICE principles).
2.  **Symptom Monitoring Guidance:** Advise the athlete on what symptoms to monitor closely.
3.  **Clear Red Flags:** Provide critical red flags that indicate the need for URGENT medical attention from a doctor or physiotherapist.
4.  **Appropriate Next Steps:** Strongly recommend consultation with a healthcare professional for an accurate diagnosis and tailored treatment plan.
5.  **Initial Phase Focus:** The first phase of the "Rehabilitation Protocol" should be titled appropriately (e.g., "Phase 1: Immediate Symptom Management & Seeking Diagnosis") and its content should reflect points 1-4 above. Avoid overly specific long-term exercises.
6.  **Subsequent Phases:** Later phases, if outlined, should be very general and clearly state they are "General guidelines pending professional diagnosis and should be confirmed by a healthcare provider."
7.  **Disclaimer Emphasis:** While a general disclaimer is always included, ensure the advice given is cautious and strongly directs the user to professional medical help. DO NOT ATTEMPT TO PROVIDE A DEFINITIVE DIAGNOSIS.
Focus on safe, general advice for the described symptoms and body part.
"""

    detailed_prompt_template = f"""
[[ACTUATE AS EXPERT AI SPORTS PHYSIOTHERAPIST & REHABILITATION SPECIALIST]]

{pre_diagnosis_instructions}

**Objective:** Generate an exceptionally detailed, personalized, and actionable multi-phased injury recovery report and exercise plan. This plan must be tailored to the specific athlete profile, their sport, their precise injury (or reported symptoms if pre-diagnosis), and their individual circumstances.

**I. ATHLETE PROFILE:**
* **Full Name/ID:** {athlete_data.athlete_id}
* **Age:** {athlete_data.age} years
* **Height:** {athlete_data.height_cm} cm
* **Weight:** {athlete_data.weight_kg} kg
* **Body Mass Index (BMI) (Calculated):** {bmi_str}
* **Sport:** {athlete_data.sport}
* **Specific Role/Position in Sport:** {athlete_data.role_in_sport or 'Not Specified'}
* **Dominant Side (if relevant):** {athlete_data.dominant_side or 'Not Specified'}
* **Competitive Level:** {athlete_data.activity_level}
* **Years of Experience in Sport:** {str(athlete_data.years_experience_sport) if athlete_data.years_experience_sport is not None else 'Not Specified'}
* **Typical Training Volume:** {str(athlete_data.training_volume_hours_per_week) if athlete_data.training_volume_hours_per_week is not None else 'Not Specified'} hours/week
* **Previous Significant Injuries & Outcomes:** {format_list(athlete_data.previous_injuries)}
* **Existing Medical Conditions:** {format_list(athlete_data.medical_conditions)}
* **Specific Recovery Goals & Timelines (Athlete's Perspective):** {athlete_data.specific_goals_recovery or 'Return to full, pain-free sport participation safely.'}
* **Access to Rehabilitation Facilities & Equipment:** {format_list(athlete_data.access_to_facilities)}
* **Psychological State/Motivation for Rehab:** {format_list(athlete_data.psychological_factors)}
* **Current Medications & Supplements:** {format_list(athlete_data.current_medications_supplements)}
* **Dietary Preferences/Restrictions (e.g., vegetarian, allergies):** {format_list(athlete_data.dietary_preferences_restrictions)}

**II. DETAILED INJURY INFORMATION:**
* **Injury Type/Diagnosis (If known, otherwise focus on reported symptoms):** {injury_details.injury_type}
* **Affected Body Part(s) & Side:** {injury_details.body_part} ({injury_details.side or 'N/A'})
* **Severity (If known, otherwise describe based on symptoms):** {injury_details.severity}
* **Date of Injury/Symptom Onset:** {str(injury_details.date_of_injury)}
* **Mechanism of Injury (How it happened, if known):** {injury_details.mechanism_of_injury or 'Not specified.'}
* **Current Symptoms (Key focus if pre-diagnosis):** {', '.join(injury_details.symptoms)}
* **Pain Assessment:**
    * At Rest (0-10 scale): {str(injury_details.pain_score_0_to_10_rest) if injury_details.pain_score_0_to_10_rest is not None else 'N/A'}
    * With Specific Movement(s) (0-10 scale): {str(injury_details.pain_score_0_to_10_movement) if injury_details.pain_score_0_to_10_movement is not None else 'N/A'} (Specify movements if known by athlete: {{{{example_movement_causing_pain}}}})
    * Type of Pain (e.g., sharp, dull, aching, radiating): {injury_details.pain_type or 'N/A'}
* **Specific Functional Limitations (What can't the athlete do?):** {format_list(injury_details.functional_limitations_specific)}
* **Imaging Results (If available, otherwise state "Not available"):** {injury_details.imaging_results or 'Not available'}
* **Professional Diagnosis (If available, otherwise state "Awaiting professional diagnosis"):** {injury_details.diagnosis_details or 'Awaiting professional diagnosis'}
* **Treatment Received So Far (If any, otherwise state "None yet"):** {format_list(injury_details.treatment_received_so_far) if injury_details.treatment_received_so_far else 'None yet'}

**III. REQUIRED REPORT STRUCTURE & CONTENT GUIDELINES:**
Generate the report with the following sections. Be specific, actionable, and tailor advice to the athlete's sport ({athlete_data.sport}), injury/symptoms ("{injury_details.injury_type}", "{', '.join(injury_details.symptoms)}"), and individual characteristics. Use the athlete's name/ID ({athlete_data.athlete_id}) when appropriate.
If this is a PRE-DIAGNOSIS scenario (as indicated at the start of this prompt), ensure the content strongly reflects the pre-diagnosis instructions provided earlier.

**REPORT FOR {athlete_data.athlete_id} - {"Initial Guidance for " + injury_details.injury_type if is_pre_diagnosis else "Recovery Plan for " + injury_details.injury_type}**

**A. Personalized Injury & Recovery Overview (JSON key: "athlete_injury_summary"):**
    1.  **Injury Synopsis (JSON key: "injury_synopsis", string):** Description of injury/symptoms.
    2.  **Impact on Sport Performance (JSON key: "impact_on_sport_performance", string):** How it affects sport.
    3.  **Key Recovery Influencers (JSON key: "key_recovery_influencers", list of strings):** Critical factors.
    4.  **Estimated Recovery Timeline (JSON key: "estimated_recovery_timeline_summary", string):** General timeline, cautious if pre-diagnosis.

**B. Phased Rehabilitation Protocol (JSON key: "rehabilitation_phases", list of phase objects):**
    (Define 3-5 distinct phases. If pre-diagnosis, Phase 1 MUST be "Immediate Symptom Management & Seeking Diagnosis". Each phase object MUST use these EXACT JSON keys):
    * **"phase_number"** (integer)
    * **"phase_name"** (string)
    * **"primary_goals"** (list of strings)
    * **"estimated_duration"** (string)
    * **"pain_inflammation_management"** (list of strings)
    * **"rom_flexibility_exercises"** (list of ExerciseDetail objects)
    * **"strengthening_exercises"** (list of ExerciseDetail objects)
    * **"neuro_control_proprio_balance_exercises"** (list of ExerciseDetail objects)
    * **"cardio_conditioning"** (list of ExerciseDetail objects; each ExerciseDetail should use "exercise_name" for the modality)
    * **"sport_specific_drills"** (list of ExerciseDetail objects or null; each ExerciseDetail should use "exercise_name" for the drill name)
    * **"precautions_contraindications"** (list of strings)
    * **"criteria_for_progression"** (list of strings)
    (Each ExerciseDetail object MUST use JSON keys: "exercise_name" (string), "description" (string, optional), "parameters" (string), "rationale" (string, optional), "sport_relevance" (string, optional))

**C. Return to {athlete_data.sport} Strategy (JSON key: "sport_specific_return_strategy"):**
    (This object MUST use these EXACT JSON keys. General if pre-diagnosis):
    * **"final_functional_tests"** (list of strings)
    * **"graduated_return_to_training_plan_summary"** (string)
    * **"preventing_reinjury_considerations"** (list of strings)

**D. Personalized Nutritional Guidance for Optimal Recovery (JSON key: "nutritional_guidance"):**
    (This object MUST use these EXACT JSON keys. General for healing if pre-diagnosis):
    * **"caloric_intake_adjustment_notes"** (string)
    * **"macronutrient_targets_summary"** (string; summarize if AI generates a sub-object for macros)
    * **"key_micronutrients_supplements"** (list of strings)
    * **"hydration_strategy"** (string)
    * **"dietary_preferences_notes"** (string, optional)

**E. Psychological & Well-being Support During Recovery (JSON key: "psychological_support"):**
    (This object MUST use these EXACT JSON keys. Address uncertainty if pre-diagnosis):
    * **"coping_strategies"** (list of strings)
    * **"goal_setting_advice"** (string)
    * **"maintaining_connection_sport"** (string)
    * **"importance_of_sleep"** (string)

**F. Progress Monitoring & Red Flags (JSON key: "monitoring_and_red_flags"):**
    (This object MUST use these EXACT JSON keys. CRITICAL for pre-diagnosis):
    * **"self_monitoring_techniques"** (list of strings)
    * **"critical_red_flags"** (list of strings - emphasize URGENT medical attention)

**G. Comprehensive Medical Disclaimer (JSON key: "disclaimer", string):**
    (Use the default disclaimer provided by the Pydantic model unless specific pre-diagnosis emphasis is needed beyond the default.)

**IMPORTANT AI OUTPUT FORMAT INSTRUCTION:**
Your entire response MUST be a single, valid JSON object. Do not use markdown formatting like ```json ... ``` around the JSON object. The JSON object must strictly adhere to the Pydantic model structure implied by the KhelVerse API, with all specified top-level and nested JSON keys. Ensure all fields are present if not optional, using appropriate data types.
"""

    # Log a snippet of the prompt for debugging (avoid logging full PII if possible in production)
    logger.info(f"Generated prompt for athlete {athlete_data.athlete_id} (first 300 chars): {detailed_prompt_template[:300]}...")

    ai_response_text = None
    report_response_object = None

    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logger.error("CRITICAL: GOOGLE_API_KEY environment variable not set.")
            raise fastapi.HTTPException(
                status_code=500, 
                detail="Server configuration error: AI service API key is missing."
            )
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(model_name=GEMINI_MODEL_NAME)

        logger.info(f"Sending request to Gemini API ({GEMINI_MODEL_NAME}) for athlete {athlete_data.athlete_id}...")
        
        # For more control over the generation, you can use generation_config:
        # generation_config = genai.types.GenerationConfig(
        #     temperature=0.4, # Lower temperature for more deterministic JSON
        #     # response_mime_type="application/json" # If supported and desired
        # )
        
        def generate_sync_call():
            # return model.generate_content(detailed_prompt_template, generation_config=generation_config)
            return model.generate_content(detailed_prompt_template)
        
        response = await asyncio.to_thread(generate_sync_call)

        # Optional: Check for prompt feedback or safety ratings
        # if response.prompt_feedback and response.prompt_feedback.block_reason:
        #     logger.warning(f"Prompt for athlete {athlete_data.athlete_id} was blocked. Reason: {response.prompt_feedback.block_reason}")
        #     raise fastapi.HTTPException(status_code=400, detail=f"Request blocked by content policy: {response.prompt_feedback.block_reason_message or 'No specific message.'}")
        # if not response.candidates: # Check if there are candidates
        #     logger.error(f"No candidates found in AI response for {athlete_data.athlete_id}. Potentially filtered or empty response.")
        #     raise fastapi.HTTPException(status_code=500, detail="AI model returned no candidates in the response.")
        
        ai_response_text = response.text # Safest if you expect a simple text response
        # If the response structure is more complex (e.g. multi-part), you might need:
        # ai_response_text = "".join(part.text for part in response.candidates[0].content.parts) if response.candidates and response.candidates[0].content.parts else ""


        logger.info(f"Raw response received from Gemini API for athlete {athlete_data.athlete_id} (length: {len(ai_response_text)})")
        # logger.debug(f"AI Response for {athlete_data.athlete_id}: {ai_response_text}") # Log full response only if necessary and secure

    except ValueError as ve: # Catches the API key error specifically
        logger.error(f"Configuration Error for AI model: {ve}", exc_info=True)
        raise fastapi.HTTPException(status_code=500, detail=str(ve)) # Will be "Server configuration error..."
    except Exception as ai_error:
        logger.error(f"Error calling Gemini API for athlete {athlete_data.athlete_id}: {ai_error}", exc_info=True)
        raise fastapi.HTTPException(status_code=503, detail=f"AI model service unavailable or error during API call: {str(ai_error)}")

    if not ai_response_text:
        logger.warning(f"AI model returned an empty response text for athlete {athlete_data.athlete_id}.")
        raise fastapi.HTTPException(status_code=500, detail="AI model returned an empty response.")

    transformed_data = None
    try:
        logger.info(f"Attempting to parse AI response as JSON for athlete {athlete_data.athlete_id}...")
        cleaned_response_text = ai_response_text.strip()
        # Remove markdown ```json ... ``` if present
        if cleaned_response_text.startswith("```json"):
            cleaned_response_text = cleaned_response_text[7:-3].strip()
        elif cleaned_response_text.startswith("```"):
             cleaned_response_text = cleaned_response_text[3:-3].strip()
        
        parsed_data = json.loads(cleaned_response_text)
        logger.info(f"Successfully parsed AI JSON for {athlete_data.athlete_id}. Starting transformation...")
        transformed_data = transform_ai_data_to_pydantic(parsed_data, athlete_data.sport)
        logger.info(f"Successfully transformed AI data for {athlete_data.athlete_id}.")
        
        # Override/set fields after transformation
        transformed_data['report_generated_for_athlete_id'] = athlete_data.athlete_id
        transformed_data['report_title'] = (
            f"AI Plan for {injury_details.injury_type}" 
            if not is_pre_diagnosis else 
            f"Initial Guidance for Reported Symptoms: {injury_details.injury_type}"
        )
        
        report_response_object = DetailedRecoveryReportResponse(**transformed_data)
        logger.info(f"Successfully validated Pydantic model for athlete {athlete_data.athlete_id}.")

    except json.JSONDecodeError as json_err:
        logger.error(f"JSONDecodeError for athlete {athlete_data.athlete_id}: Failed to parse AI response. Error: {json_err}. Response snippet: {ai_response_text[:500]}", exc_info=True)
        raise fastapi.HTTPException(status_code=500, detail=f"AI model returned invalid JSON. Check server logs. Error: {str(json_err)}")
    except pydantic.ValidationError as val_err:
        error_details = val_err.errors()
        logger.error(f"Pydantic ValidationError for athlete {athlete_data.athlete_id}: AI's JSON does not match schema. {len(error_details)} error(s). First error: {error_details[0]}. Transformed data snippet: {str(transformed_data)[:500]}", exc_info=False) # exc_info=False to avoid redundant stack trace if transformed_data is logged
        # logger.debug(f"Full transformed data causing Pydantic error for {athlete_data.athlete_id}: {transformed_data}") # Full data for debugging
        raise fastapi.HTTPException(status_code=500, detail=f"AI model's response structure mismatch. {len(error_details)} error(s). First error: {error_details[0]['msg']} for field {error_details[0]['loc']}. Check server logs.")
    except Exception as e:
        logger.error(f"Unexpected error processing AI response for athlete {athlete_data.athlete_id}: {e}. Response snippet: {ai_response_text[:500]}", exc_info=True)
        raise fastapi.HTTPException(status_code=500, detail=f"Unexpected error processing AI response. Check server logs. Error: {str(e)}")

    if not report_response_object:
        logger.critical(f"Critical error: Report object is None for athlete {athlete_data.athlete_id} after AI processing and parsing attempts.")
        raise fastapi.HTTPException(status_code=500, detail="Failed to generate structured report from AI response. Unknown issue post-processing.")
        
    return report_response_object

# --- API Endpoint ---
@app.post("/detailed-injury-recovery/", response_model=DetailedRecoveryReportResponse, tags=["Detailed Injury Recovery"])
async def create_detailed_injury_recovery_plan(request: InjuryRecoveryDetailedRequest = fastapi.Body(...)):
    """
    Generates a detailed, AI-driven injury recovery plan tailored to the athlete's specific
    profile, injury (or symptoms if pre-diagnosis), and individual circumstances.
    """
    try:
        logger.info(f"Received request for detailed injury recovery plan for athlete: {request.athlete_data.athlete_id}")
        recovery_plan = await get_ai_detailed_recovery_plan(
            athlete_data=request.athlete_data,
            injury_details=request.injury_details
        )
        logger.info(f"Successfully generated recovery plan for athlete: {request.athlete_data.athlete_id}")
        return recovery_plan
    except fastapi.HTTPException as http_exc:
        # Logged in get_ai_detailed_recovery_plan or will be caught by FastAPI default
        logger.warning(f"HTTPException for athlete {request.athlete_data.athlete_id if request and request.athlete_data else 'unknown'}: {http_exc.status_code} - {http_exc.detail}")
        raise http_exc # Re-raise the HTTPException
    except Exception as e:
        logger.error(f"Unhandled error in create_detailed_injury_recovery_plan endpoint for athlete {request.athlete_data.athlete_id if request and request.athlete_data else 'unknown'}: {e}", exc_info=True)
        raise fastapi.HTTPException(status_code=500, detail=f"An critical internal server error occurred: {str(e)}")

# If you want to run this locally using Uvicorn directly (for testing):
# import uvicorn
# if __name__ == "__main__":
#     uvicorn.run("khelverse_detailed_injury_recovery:app", host="0.0.0.0", port=8000, reload=True)