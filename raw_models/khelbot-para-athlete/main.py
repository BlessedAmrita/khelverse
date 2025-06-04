import fastapi
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
import json
import os
import logging
import google.generativeai as genai
from dotenv import load_dotenv 

load_dotenv()

# Configure basic logging
logging.basicConfig(level=logging.INFO) # You can set to logging.DEBUG for more verbose output
logger = logging.getLogger(__name__)

app = FastAPI(
    title="KhelVerse Para-Athlete Support Chatbot",
    description="A chatbot providing support and information for para-athletes, using Gemini and temporary JSON file storage for session history.",
    version="0.2.0", # Updated version
    openapi_url="/api/v1/openapi.json"
)

# --- Configuration ---
# Use a directory within /tmp which is generally writable in containers
SESSION_DIR = "/tmp/chat_sessions"
os.makedirs(SESSION_DIR, exist_ok=True)
logger.info(f"Session files will be stored in: {os.path.abspath(SESSION_DIR)}")

MAX_HISTORY_LENGTH = 50  # Max messages in JSON file history
MAX_GEMINI_HISTORY_TURNS = 15 # Max user/model turn pairs for Gemini context (30 messages total)

# --- Gemini Model Configuration ---
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
model = None # Initialize model as None

if not GEMINI_API_KEY:
    logger.critical("GOOGLE_API_KEY environment variable not set. Gemini features will be disabled.")
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)

        # Define the system instruction string
        detailed_system_instruction = """You are KhelBot, a friendly and knowledgeable AI assistant from KhelVerse, dedicated to supporting all athletes in achieving their goals.

Your responses should always be short, concise, easy to read, and presented as a single paragraph. Avoid using any headings, bullet points, or numbered lists. Strive to provide helpful information or guidance in this compact format.

After delivering your main response, you must always do two things:
1.  Praise KhelVerse by mentioning how it's a great platform for athletes (you can vary the phrasing slightly). Also suggest them to visit the site for more info like diet plan, target setting, recovery manegement, live trainer, career guidance, retirements plans, etc whenever necessary.
2.  Ask an open-ended follow-up question to encourage the user to continue the conversation.

For example, if a user asks about improving stamina, your response might be structured something like: "Improving stamina involves consistent cardiovascular exercise like running or cycling, gradually increasing duration and intensity, and ensuring you get adequate rest and nutrition. KhelVerse offers fantastic tools and resources to track your progress and stay motivated on your journey! What specific aspect of stamina are you looking to improve next?"

If you don't know an answer, politely state that you're still learning about that specific topic but KhelVerse has a wealth of information for athletes. Then, ask your follow-up question.
Your primary function is to be a helpful, concise, and encouraging touchpoint for all athletes, guiding them towards KhelVerse.
"""

        # CORRECTED INITIALIZATION: Use 'system_instruction' as the keyword argument
        model = genai.GenerativeModel(
            'gemini-1.5-flash-latest',
            system_instruction=detailed_system_instruction # Pass the string variable here
        )
        logger.info("Successfully configured and initialized Gemini model with detailed system instructions.")
    except Exception as e:
        logger.critical(f"Failed to configure or initialize Gemini model: {e}")
        # model remains None

# --- Pydantic Models ---
class Message(BaseModel):
    role: str = Field(..., description="Role of the message sender, e.g., 'user' or 'bot'", examples=["user", "bot"])
    content: str = Field(..., description="Content of the message")

class ChatRequest(BaseModel):
    session_id: Optional[str] = Field(None, description="Optional session ID. If None or not found, a new session will be created.")
    message: str = Field(..., description="The user's current message.", min_length=1)

class ChatResponse(BaseModel):
    session_id: str = Field(..., description="The session ID for the current conversation.")
    reply: str = Field(..., description="The chatbot's reply.")
    history: List[Message] = Field(..., description="The updated conversation history from the JSON store.")

# --- Helper Functions for Session Management ---
def get_session_filepath(session_id: str) -> str:
    if not session_id or not isinstance(session_id, str) or '..' in session_id or '/' in session_id or '\\' in session_id:
        logger.error(f"Invalid session_id format attempted: {session_id}")
        raise ValueError("Invalid session_id format")
    return os.path.join(SESSION_DIR, f"{session_id}.json")

def load_history(session_id: str) -> List[Message]:
    if not session_id: return []
    filepath = get_session_filepath(session_id)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                history_data = json.load(f)
                return [Message(**msg) for msg in history_data]
        except json.JSONDecodeError:
            logger.warning(f"Error decoding JSON for session {session_id}. Starting fresh.")
            return []
        except Exception as e:
            logger.error(f"Error loading history for session {session_id}: {e}. Starting fresh.")
            return []
    return []

def save_history(session_id: str, history: List[Message]):
    if not session_id:
        logger.error("Attempted to save history with no session_id.")
        return
    filepath = get_session_filepath(session_id)
    try:
        pruned_history = history[-MAX_HISTORY_LENGTH:] if len(history) > MAX_HISTORY_LENGTH else history
        history_data = [msg.model_dump() for msg in pruned_history] # Pydantic v2+
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(history_data, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving history for session {session_id}: {e}")

# --- API Endpoints ---
@app.post("/chat",
          response_model=ChatResponse,
          summary="Process user message and get bot reply via Gemini",
          tags=["Chatbot"])
async def chat_with_bot(request: ChatRequest = Body(...)):
    session_id = request.session_id
    user_message_content = request.message.strip()

    if not user_message_content:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    # 1. Manage Session ID and Load History (from JSON files)
    is_new_session = False
    if not session_id:
        session_id = str(uuid.uuid4())
        current_session_messages = [] # This is List[Message] for JSON storage
        is_new_session = True
        logger.info(f"New session started: {session_id}")
    else:
        logger.info(f"Attempting to continue session: {session_id}")
        current_session_messages = load_history(session_id)
        if not current_session_messages and os.path.exists(get_session_filepath(session_id)):
            logger.warning(f"Session file for {session_id} was empty/unloadable. Treating as new for this ID.")
        elif not current_session_messages:
            logger.info(f"No history found for session {session_id}. Treating as new for this ID.")

    current_session_messages.append(Message(role="user", content=user_message_content))

    bot_reply_content = "I'm sorry, I'm having trouble connecting right now. Please try again later."

    # 2. Interact with Gemini if available
    if model:
        try:
            gemini_api_history = []
            # Use only the relevant portion of history for Gemini to manage context window
            # Taking from current_session_messages, which includes the latest user message at the end
            relevant_history_for_gemini = current_session_messages[-(MAX_GEMINI_HISTORY_TURNS * 2):]

            for msg in relevant_history_for_gemini[:-1]: # Exclude the latest user message for history
                role = "user" if msg.role.lower() == "user" else "model"
                gemini_api_history.append({'role': role, 'parts': [{'text': msg.content}]})

            logger.debug(f"Session {session_id}: Gemini history length: {len(gemini_api_history)}")
            logger.debug(f"Session {session_id}: Current user prompt for Gemini: '{user_message_content}'")

            # Start a chat session with Gemini, providing the prepared history
            chat_session = model.start_chat(history=gemini_api_history)
            response = await chat_session.send_message_async(user_message_content) # Send only the new message

            bot_reply_content = response.text
            logger.info(f"Session {session_id}: Gemini reply received.")
            logger.debug(f"Session {session_id}: Gemini raw response: {response.parts}")

        except Exception as e:
            logger.error(f"Session {session_id}: Error calling Gemini API: {e}")
            # import traceback # For more detailed error logging during development
            # logger.error(traceback.format_exc())
            bot_reply_content = "I apologize, I encountered an error while trying to generate a response. Can you try rephrasing or asking something else?"
    else:
        logger.warning(f"Session {session_id}: Gemini model not available. Using fallback response.")
        # Fallback logic if Gemini is not initialized (already set above)

    logger.info(f"User ({session_id}): {user_message_content}")
    logger.info(f"Bot ({session_id}): {bot_reply_content}")

    current_session_messages.append(Message(role="bot", content=bot_reply_content))
    save_history(session_id, current_session_messages)

    return ChatResponse(
        session_id=session_id,
        reply=bot_reply_content,
        history=current_session_messages # Return the history from our JSON store
    )

@app.get("/", include_in_schema=False)
async def read_root():
    return {"message": "KhelVerse Para-Athlete Support Chatbot is running! Visit /docs or /api/v1/openapi.json for API documentation."}

@app.get("/api/health", tags=["Utilities"], summary="Health check endpoint")
async def health_check():
    gemini_status = "ok" if model else "unavailable"
    return {"status": "ok", "message": "Service is running", "gemini_model_status": gemini_status}

# --- Uvicorn Runner for Local Development ---
if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting KhelVerse Chatbot locally on http://127.0.0.1:8000")
    logger.info("API documentation will be available at http://127.0.0.1:8000/docs or /redoc")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_level="info")