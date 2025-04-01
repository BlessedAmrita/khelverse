import os
import logging
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import re  # Extract JSON safely

# Load environment variables
load_dotenv()

# Retrieve API Key
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY. Please set it in the .env file.")

# Configure Gemini AI
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# Initialize API Router
router = APIRouter()

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Define Request Model
class PlayerProfile(BaseModel):
    sport: str
    position: str
    age: int
    weight: float
    height: float
    goal: str
    language: str  # Add language field for translation

# Function to extract JSON from AI response
def extract_json(response_text: str) -> dict:
    """Extract JSON from the AI response safely."""
    try:
        json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            return json.loads(json_str)
        else:
            raise ValueError("No valid JSON found in AI response.")
    except Exception as e:
        logging.error(f"⚠️ Error parsing AI JSON response: {e}")
        return {"error": "AI response did not return valid JSON."}

# Function to translate JSON values while keeping the structure intact
def translate_text(json_content: dict, target_language: str) -> dict:
    """Use Gemini to translate only the values in JSON content while keeping the keys and structure intact."""
    if target_language.lower() == "en":
        return json_content  # No translation needed

    try:
        translation_prompt = f"""
        Translate the values in the following JSON into **{target_language}**. 
        Keep the JSON structure and keys unchanged.

        JSON:
        ```json
        {json.dumps(json_content, ensure_ascii=False)}
        ```

        Return only valid JSON without extra text.
        """

        response = model.generate_content(translation_prompt)

        if not response or not response.text:
            raise ValueError("Empty translation response.")

        return extract_json(response.text.strip())

    except Exception as e:
        logging.error(f"⚠️ Translation error: {str(e)}")
        return json_content  # Fallback to original if translation fails

# AI-based Diet Plan Generation
def generate_diet_plan(player_profile: PlayerProfile) -> dict:
    try:
        prompt = f"""
        Suggest a **daily meal plan** for an athlete based on the following details:
        - **Sport**: {player_profile.sport}
        - **Position**: {player_profile.position}
        - **Age**: {player_profile.age}
        - **Weight**: {player_profile.weight} kg
        - **Height**: {player_profile.height} cm
        - **Training Goal**: {player_profile.goal}

        Provide a structured meal plan including:
        - **Breakfast**
        - **Lunch**
        - **Dinner**
        - **Snacks**
        - **Macronutrient Breakdown (Protein, Carbs, Fats)**

        Return the response in this **JSON format**:
        ```json
        {{
          "diet_plan": {{
            "overview": {{
              "sport": "{player_profile.sport}",
              "position": "{player_profile.position}",
              "age": {player_profile.age},
              "weight": {player_profile.weight},
              "height": {player_profile.height},
              "goal": "{player_profile.goal}"
            }},
            "meal_plan": {{
              "breakfast": ["Example breakfast item 1", "Example breakfast item 2"],
              "lunch": ["Example lunch item 1", "Example lunch item 2"],
              "snacks": ["Example snack item 1", "Example snack item 2"],
              "dinner": ["Example dinner item 1", "Example dinner item 2"]
            }},
            "macronutrients": {{
              "protein": "Example grams of protein",
              "carbs": "Example grams of carbs",
              "fats": "Example grams of fats"
            }}
          }}
        }}
        ```

        Return only **valid JSON**.
        """

        response = model.generate_content(prompt)

        if not response or not response.text:
            raise ValueError("AI response is empty.")

        response_text = response.text.strip()
        diet_plan = extract_json(response_text)  # Extract only valid JSON

        # Translate values if language is not English
        if player_profile.language.lower() != 'en':
            diet_plan = translate_text(diet_plan, player_profile.language)

        return diet_plan

    except Exception as e:
        logging.error(f"❌ Error in AI response: {str(e)}")
        return {"error": "Failed to generate diet plan."}

# Diet Plan Endpoint
@router.post("/generate_diet/")
async def generate_diet(player_profile: PlayerProfile):
    try:
        logging.info(f"📩 Received Diet Plan Request: {player_profile}")
        diet_plan = generate_diet_plan(player_profile)
        return JSONResponse(content=diet_plan, status_code=200)
    except Exception as e:
        logging.error(f"❌ Error Processing Request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
