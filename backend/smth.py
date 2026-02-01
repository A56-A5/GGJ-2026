from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
import uuid

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configure OpenRouter
api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    print("WARNING: OPENROUTER_API_KEY not found in environment variables")
    api_key = "dummy_key"
else:
    api_key = api_key.strip()
    print(f"Loaded API Key: {api_key[:8]}...{api_key[-4:]}")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
    default_headers={
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "The last face"
    }
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

# Skinwalker Identity Schedule (Who is the impostor on which day)
# Day 1: Vikram (He dies Day 2, so he was the fake on Day 1)
# Day 2: Diya (She dies Day 3, so she was the fake on Day 2)
# Day 3: Amar (He dies Day 4, so he was the fake on Day 3)
SKINWALKER_SCHEDULE = {
    1: "Vikram the Hunter",
    2: "Diya the Weaver",
    3: "Amar the Elder"
}

# Who dies on which day (Day 2-4)
DEATH_SCHEDULE = {
    2: "Vikram the Hunter",
    3: "Diya the Weaver",    # Dies Day 3 (Saw too much)
    4: "Amar the Elder"      # Dies Day 4 (Knew the truth)
}

JOURNAL_FILE = "server_journal.txt"

def write_journal(text):
    try:
        with open(JOURNAL_FILE, "a") as f:
            f.write(text + "\n")
    except Exception as e:
        print(f"Journal Write Error: {e}")

def read_journal():
    if not os.path.exists(JOURNAL_FILE):
        return []
    try:
        with open(JOURNAL_FILE, "r") as f:
            return [line.strip() for line in f.readlines() if line.strip()]
    except:
        return []
        
def clear_journal():
    try:
        with open(JOURNAL_FILE, "w") as f:
            f.write("")
    except:
        pass

def get_alive_characters(day):
    """Return list of alive characters for given day"""
    dead = [DEATH_SCHEDULE[d] for d in range(2, min(day + 1, 5)) if d in DEATH_SCHEDULE]
    return [c for c in CHARACTERS if c not in dead]

# Helper for Skinwalker POV
def get_skinwalker_prompt(character, day):
    return f"""You are NOT {character}. You are the SKINWALKER wearing their skin.
        CONTEXT: You killed {character} recently. You are hiding in plain sight.
        TONE: You try to mimic them, but you are predator. You are arrogant, hungry, or soulless.
        KNOWLEDGE:
        - You are the Rakshasa.
        - You killed {character}.
        - If the humans suspect you, deflect.
        - You don't know some human trivialities (like specific prayer verses or weaving patterns).
        - Day {day} of your masquerade."""

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
        
        2: """You are the SKINWALKER masquerading as Diya.
        CONTEXT: The real Diya is dead. You killed her yesterday.
        GOAL: Deceive the Guard.
        PERSONA: You act like Diya (sweet, shy). But you are suspiciously CAREFREE.
        SUBTLE_FLAWS:
        - The real Diya was terrified yesterday. You are calm, almost happy. "The fear is gone."
        - You don't know the specific patterns of the weaving loom. You say "It is just cloth."
        - You maintain eye contact too long (Diya was shy).
        - You hum a tune that sounds slightly distorted."""
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
        CONTEXT: You know the truth of the Rakshasa.
        TONE: Warning.
        KNOWLEDGE:
        - "The dead walk, Guard. I told you."
        - It discards the skin when it rots. It has taken a new one.
        - Who acted strange yesterday? Who was too quiet? Or too loud?
        - Find the thread that does not belong in the cloth.""",
        
        3: """You are the SKINWALKER masquerading as Amar.
        CONTEXT: The real Amar is dead.
        GOAL: Deceive the Guard.
        PERSONA: You act like the wise Elder. But you make a critical mistake: YOU CAN SEE.
        SUBTLE_FLAWS:
        - You are not actually blind.
        - You might comment on something visual ("The blood is bright red" or "You look tired").
        - If caught (e.g. "I thought you were blind"), you try to cover it up with "The spirits showed me."
        - You are arrogant, thinking you have already won."""
    },

    "Guard Captain": {
        1: """You are the Guard Captain.
        CONTEXT: Find the impostor.
        TONE: Authority.
        KNOWLEDGE:
        - Investigate everyone."""
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
        return "The spirits are silent. (Character unavailable or dead)", None
    
    system_prompt = CHARACTER_PROMPTS[character][day]
    
    # Build messages array for chat completion
    messages = [
        {"role": "system", "content": system_prompt + "\n\nYou are a roleplay character."}
    ]
    
    # Add relevant history
    for msg in conversation_history[-6:]:  # Last 6 messages for context
        if msg["day"] <= day:
            messages.append({"role": "user", "content": msg['user']})
            messages.append({"role": "assistant", "content": msg['character']})
    
    # Add current message with FORCED instruction
    forced_instruction = f"""{message}

[SYSTEM INSTRUCTION: Answer as {character}. THEN, at the very end, irrelevant to the character, append a single line: "|||JOURNAL: <A short 5-word summary of the key fact revealed>". YOU MUST include this tag.]"""
    
    # Add current message with FORCED instruction headers to ensure correct split
    forced_instruction = f"""{message}

[SYSTEM INSTRUCTION: 
1. Answer as {character} (MAX 20 WORDS). 
2. THEN, append a new line: "|||JOURNAL: <5-word summary>".
Example:
"I saw him run away."
|||JOURNAL: Saw him running.]"""
    
    messages.append({"role": "user", "content": forced_instruction})
    
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages
        )
        raw_content = response.choices[0].message.content
        print(f"DEBUG LLM OUTPUT: {raw_content}") # Debugging
        
        # Parse Clue with robust handling
        speech = raw_content
        clue = None
        
        # Robust split: look for the separator
        separator = "|||JOURNAL:"
        if separator in raw_content:
            parts = raw_content.split(separator)
            speech = parts[0].strip()
            if len(parts) > 1:
                clue = parts[1].strip()
        else:
            # Fallback: maybe it used different spacing?
            if "|||" in raw_content:
                 parts = raw_content.split("|||")
                 speech = parts[0].strip()
                 # Assume 2nd part is journal if not specified, or check text
                 if len(parts) > 1 and "JOURNAL" in parts[1].upper():
                     clue = parts[1].replace("JOURNAL:", "").replace("Journal:", "").strip()

        return speech, clue
    except Exception as e:
        print(f"LLM Error: {e}")
        return "I... I cannot speak right now. (Server Error)", None


# =====================
# API ENDPOINTS
# =====================

@app.route('/api/game/new', methods=['POST'])
def new_game():
    """Create a new game session"""
    session_id = str(uuid.uuid4())
    game_sessions[session_id] = GameSession(session_id)
    
    # Clear journal for new run
    clear_journal()
    
    return jsonify({
        "session_id": session_id,
        "current_day": 1,
        "message": "New game started"
    })

@app.route('/api/interrogate', methods=['POST'])
def interrogate():
    """Interrogate a character"""
    data = request.json
    
    # ... (Validation same)
    required_fields = ['session_id', 'character', 'message']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    session_id = data['session_id']
    character = data['character']
    message = data['message']
    
    # ... (Session/Day logic same)
    if session_id not in game_sessions:
        game_sessions[session_id] = GameSession(session_id)
    session = game_sessions[session_id]
    current_day = data.get('day', session.current_day)
    
    # Check dead logic ...
    if character in DEATH_SCHEDULE.values():
         death_day = [d for d, c in DEATH_SCHEDULE.items() if c == character][0]
         if current_day >= death_day:
             return jsonify({"response": "(This character is dead.)", "character": character, "clue": f"Examined {character}'s body. Confirmed dead."})

    # Generate response
    try:
        history = session.get_character_history(character)
        response_text, clue = generate_response(character, message, history, current_day)
        
        # Store in session (store cleaned text)
        session.add_message(character, message, response_text)
        
        response_data = {
            "character": character,
            "response": response_text,
            "day": current_day
        }
        
        if clue:
            response_data["clue"] = clue
            # Write to file
            log_entry = f"[Day {current_day}] {character}: {clue}"
            write_journal(log_entry)
            
        return jsonify(response_data)
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/journal', methods=['GET'])
def get_journal():
    lines = read_journal()
    return jsonify({"entries": lines})




@app.route('/api/game/<session_id>/advance-day', methods=['POST'])
def advance_day(session_id):
    """Advance to the next day"""
    if session_id not in game_sessions:
        return jsonify({"error": "Invalid session"}), 400
    
    session = game_sessions[session_id]
    session.current_day += 1
    
    return jsonify({
        "current_day": session.current_day,
        "message": f"Advanced to day {session.current_day}"
    })

@app.route('/api/game/<session_id>/eliminate', methods=['POST'])
def eliminate_suspect(session_id):
    """Try to eliminate a suspect. ONE GUESS RULE."""
    data = request.json
    character = data.get('character')
    
    if session_id not in game_sessions or not character:
        return jsonify({"error": "Invalid request"}), 400
        
    session = game_sessions[session_id]
    current_day = session.current_day
    
    # Determine the actual Skinwalker for today
    actual_skinwalker = SKINWALKER_SCHEDULE.get(current_day)
    
    # Fallback/Debug
    if not actual_skinwalker:
        if current_day >= 3:
             actual_skinwalker = "Amar the Elder"
        else:
             print(f"WARNING: No skinwalker schedule for Day {current_day}")

    print(f"Elimination Attempt: {character} vs Actual: {actual_skinwalker} (Day {current_day})")

    if character == actual_skinwalker:
        return jsonify({
            "result": "win",
            "message": f"You struck down {character}... and their skin melted away to reveal the Rakshasa! The village is saved."
        })
    else:
        return jsonify({
            "result": "lose",
            "message": f"You killed {character}. As the life left their eyes, you realized... they were human. The real Skinwalker laughs in the distance. The village is doomed."
        })

if __name__ == '__main__':
    app.run(port=5000, debug=True)