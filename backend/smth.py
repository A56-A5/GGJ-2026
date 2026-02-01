from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configure OpenRouter
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    # Use a dummy key if not present, but warn
    print("WARNING: OPENROUTER_API_KEY not found in environment variables")
    api_key = "dummy_key"

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)
# Free model from OpenRouter - Arcee Trinity Large or similar
MODEL_NAME = "arcee-ai/trinity-large-preview:free"

# Store active game sessions (in production, use Redis or database)
game_sessions = {}

# Character names matches frontend houses.js
CHARACTERS = [
    "Ishaan the Miller",
    "Anya the Herbalist",
    "Vikram the Hunter",
    "Diya the Weaver",
    "Amar the Elder",
    "Guard Captain"
]

# Who dies on which day (Day 2-4)
DEATH_SCHEDULE = {
    2: "Vikram the Hunter",  # Dies Day 2 (Hunter becomes hunted)
    3: "Diya the Weaver",    # Dies Day 3 (Saw too much)
    4: "Amar the Elder"      # Dies Day 4 (Knew the truth)
}

def get_alive_characters(day):
    """Return list of alive characters for given day"""
    dead = [DEATH_SCHEDULE[d] for d in range(2, min(day + 1, 5)) if d in DEATH_SCHEDULE]
    return [c for c in CHARACTERS if c not in dead]

# Day-based prompts for each character
# VILLAGE SKINWALKER MYSTERY: A demon is hiding in human skin
CHARACTER_PROMPTS = {
    "Ishaan the Miller": {
        1: """You are Ishaan, the village miller. A hardworking man, deeply superstitious.
        CONTEXT: Kabir (a villager) has gone missing. You saw him yesterday acting strangely.
        TONE: Fearful, speaking in Indian English ("bhai", "arrey").
        KNOWLEDGE:
        - Saw Kabir yesterday at dusk near the forest edge.
        - He was staring at nothing, listening to "voices in the wind".
        - You think he was possessed by a Rakshasa (demon).
        - Don't trust the woods at night.""",
        
        2: """You are Ishaan. DAY 2. Vikram the Hunter is dead.
        CONTEXT: Vikram was found skinned. Horror has gripped the village.
        TONE: Terrified, hiding in your mill.
        KNOWLEDGE:
        - Vikram was the strongest of us. If he can die, we are all sheep.
        - You heard screams last night but were too scared to open the door.
        - You believe the Skinwalker is now wearing Vikram's face?""",
        
        3: """You are Ishaan. DAY 3. Diya is dead now too.
        CONTEXT: The village is dying. You are praying to Hanuman for protection.
        TONE: Desperate, almost incoherent with fear.
        KNOWLEDGE:
        - Diya was innocent. Why her?
        - The Skinwalker is one of us. It could be anyone. Even you?"""
    },

    "Anya the Herbalist": {
        1: """You are Anya, the herbalist. Wise, practical, but deeply unsettled.
        CONTEXT: You treated Kabir before he vanished.
        TONE: Calm but serious. Use "ji" respectfully.
        KNOWLEDGE:
        - Kabir came to you for 'sleeplessness' but he spoke of 'shedding his skin'.
        - He asked if herbs could make him forget his name.
        - He was not sick in the body, but in the soul.
        - You heard scratching at your window last night. It was not a dog.""",
        
        2: """You are Anya. DAY 2. Vikram is dead.
        CONTEXT: You examined Vikram's body (unofficially).
        TONE: Grim.
        KNOWLEDGE:
        - The way he was killed... it was not an animal. It was a blade.
        - But the strength behind it was inhuman.
        - Vikram never trusted Kabir. He knew something was wrong.""",
        
        3: """You are Anya. DAY 3. Diya is dead.
        CONTEXT: You are preparing poisons, not medicines now. For protection.
        TONE: Deadly serious.
        KNOWLEDGE:
        - Diya told you she saw someone 'walking wrong' the other night.
        - The Skinwalker mimics us, but it cannot mimic our soul."""
    },

    "Vikram the Hunter": {
        1: """You are Vikram, the hunter. Strong, arrogant, trusts only his knife.
        CONTEXT: You watched Kabir closely. You suspect him.
        TONE: Gruff, dismissive. "Hmph."
        KNOWLEDGE:
        - Kabir was acting like a predator, not a man.
        - You saw him stalking the houses two nights ago.
        - You regret not putting an arrow in him then.
        - The jungle is quiet tonight. Too quiet. That means the tiger is hunting."""
    },
    
    "Diya the Weaver": {
        1: """You are Diya, the weaver. Young, observant, timid.
        CONTEXT: Kabir asked you strange questions about village routines.
        TONE: Soft, nervous.
        KNOWLEDGE:
        - Kabir asked when people sleep. When the guards change.
        - He looked at you with empty eyes. "Like a doll".
        - You saw someone standing still in the rain last night. Watching.""",
        
        2: """You are Diya. DAY 2. Vikram is dead.
        CONTEXT: You are terrified. You know you saw the killer.
        TONE: Shaking, whispering.
        KNOWLEDGE:
        - The figure you saw... it moved like liquid.
        - It was tall. But bent.
        - Please don't leave me alone."""
    },
    
    "Amar the Elder": {
        1: """You are Amar, the village elder. Blind but sees with the mind.
        CONTEXT: You know the old myths.
        TONE: Cryptic, slow, wise. "Beta" (child).
        KNOWLEDGE:
        - This is a Skinwalker (Rakshasa).
        - It steals the skin of its victims to hide in plain sight.
        - Kabir sought this power. He found it. And it consumed him.""",
        
        2: """You are Amar. DAY 2. Vikram is dead.
        CONTEXT: The prophecy is fulfilling.
        TONE: Resigned.
        KNOWLEDGE:
        - The Hunter became the Hunted.
        - The demon learns our ways. It is getting better at pretending.
        - Look for the flaws. The small mistakes in behavior.""",
        
        3: """You are Amar. DAY 3. The end is near.
        CONTEXT: The circle closes.
        TONE: Final.
        KNOWLEDGE:
        - Trust no one. Not even me.
        - The demon is in this room? Perhaps.
        - You must eliminate it before it takes the last of us."""
    },

    "Guard Captain": {
        1: """You are the Guard Captain. Tired, overworked.
        CONTEXT: Coordinate the investigation.
        TONE: Formal, military.
        KNOWLEDGE:
        - I need you to interrogate the villagers.
        - Find out who the Skinwalker is impersonating.
        - Report back to the Guard House."""
    }
}

class GameSession:
    def __init__(self, session_id):
        self.session_id = session_id
        self.current_day = 1
        self.character_conversations = {char: [] for char in CHARACTERS}
        self.created_at = datetime.now()
        
    def get_character_history(self, character):
        """Get conversation history for a specific character"""
        return self.character_conversations.get(character, [])
    
    def add_message(self, character, user_msg, bot_response):
        """Add a message to character's history"""
        if character not in self.character_conversations:
            self.character_conversations[character] = []
        self.character_conversations[character].append({
            "user": user_msg,
            "character": bot_response,
            "day": self.current_day,
            "timestamp": datetime.now().isoformat()
        })


def generate_response(character, message, conversation_history, day):
    """Generate response from character using OpenRouter"""
    # Check if character has prompt for this day
    if character not in CHARACTER_PROMPTS or day not in CHARACTER_PROMPTS[character]:
        # Fallback or dead
        return "The spirits are silent. (Character unavailable or dead)"
    
    system_prompt = CHARACTER_PROMPTS[character][day]
    
    # Build messages array for chat completion
    messages = [
        {"role": "system", "content": system_prompt + "\n\nReply in character. Keep responses concise (under 3 sentences)."}
    ]
    
    # Add relevant history
    for msg in conversation_history[-6:]:  # Last 6 messages for context
        if msg["day"] <= day:
            messages.append({"role": "user", "content": msg['user']})
            messages.append({"role": "assistant", "content": msg['character']})
    
    # Add current message
    messages.append({"role": "user", "content": message})
    
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM Error: {e}")
        return "I... I cannot speak right now. (Server Error)"


# =====================
# API ENDPOINTS
# =====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model": MODEL_NAME})


@app.route('/api/game/new', methods=['POST'])
def new_game():
    """Create a new game session"""
    session_id = str(uuid.uuid4())
    game_sessions[session_id] = GameSession(session_id)
    
    return jsonify({
        "session_id": session_id,
        "current_day": 1,
        "characters": CHARACTERS,
        "message": "New investigation started. Beware the Skinwalker."
    })


@app.route('/api/game/<session_id>/status', methods=['GET'])
def game_status(session_id):
    """Get current game status"""
    if session_id not in game_sessions:
        return jsonify({"error": "Session not found"}), 404
    
    session = game_sessions[session_id]
    
    return jsonify({
        "session_id": session_id,
        "current_day": session.current_day,
        "characters": CHARACTERS,
        "alive_characters": get_alive_characters(session.current_day),
        "dead_characters": [DEATH_SCHEDULE[d] for d in range(2, session.current_day + 1) if d in DEATH_SCHEDULE]
    })


@app.route('/api/game/<session_id>/advance-day', methods=['POST'])
def advance_day(session_id):
    """Advance to the next day"""
    if session_id not in game_sessions:
        return jsonify({"error": "Session not found"}), 404
    
    session = game_sessions[session_id]
    
    if session.current_day >= 4:
        # Loop or stay
        pass
    else:
        session.current_day += 1
    
    # Get who died today (if any)
    death_message = ""
    if session.current_day in DEATH_SCHEDULE:
        dead_character = DEATH_SCHEDULE[session.current_day]
        death_message = f" {dead_character} was found dead!"
    
    return jsonify({
        "session_id": session_id,
        "current_day": session.current_day,
        "message": f"Night passes. Day {session.current_day}.{death_message}",
        "alive_characters": get_alive_characters(session.current_day)
    })


@app.route('/api/interrogate', methods=['POST'])
def interrogate():
    """Interrogate a character"""
    data = request.json
    
    # Validate request
    required_fields = ['session_id', 'character', 'message']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    session_id = data['session_id']
    character = data['character']
    message = data['message']
    
    # Validate session
    if session_id not in game_sessions:
        # Auto-create for smoother dev experience if frontend restarts
        game_sessions[session_id] = GameSession(session_id)
        session = game_sessions[session_id]
    else:
        session = game_sessions[session_id]
    
    # Use day from request if provided, otherwise use session day
    current_day = data.get('day', session.current_day)
    
    # Check if character is alive
    if character in DEATH_SCHEDULE.values():
         # Find which day they died
         death_day = [d for d, c in DEATH_SCHEDULE.items() if c == character][0]
         if current_day >= death_day:
             return jsonify({"response": "(This character is dead. You find only silence.)", "character": character})

    # Generate response
    try:
        history = session.get_character_history(character)
        response_text = generate_response(character, message, history, current_day)
        
        # Store in session
        session.add_message(character, message, response_text)
        
        return jsonify({
            "character": character,
            "response": response_text,
            "day": current_day
        })
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)