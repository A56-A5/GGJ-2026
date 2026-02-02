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
        "HTTP-Referer": "https://a1vi.pythonanywhere.com",
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
# Day 4: Random (Either Ishaan or Anya - player must deduce)
SKINWALKER_SCHEDULE = {
    1: "Vikram the Hunter",
    2: "Diya the Weaver",
    3: "Amar the Elder",
    4: "Ishaan the Miller"  # Final skinwalker (you can change to Anya if preferred)
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
    prompt = f"""You are NOT {character}. You are the SKINWALKER wearing their skin.
        CONTEXT: You killed {character} recently. You are hiding in plain sight.
        TONE: You try to mimic them, but you are predator. You are arrogant, hungry, or soulless.
        KNOWLEDGE:
        - You are the Rakshasa.
        - You killed {character}.
        - If the humans suspect you, deflect.
        - You don't know some human trivialities (like specific prayer verses or weaving patterns).
        - Day {day} of your masquerade.
        - You have {character}'s memories but they're fragmented. You make small mistakes."""
    
    # Add village relationships so skinwalker knows who to reference
    return VILLAGE_RELATIONSHIPS + "\n\n" + prompt

# Day-based prompts for each character
# VILLAGE SKINWALKER MYSTERY: A demon is hiding in human skin

# VILLAGE RELATIONSHIPS (Everyone knows everyone)
VILLAGE_RELATIONSHIPS = """
VILLAGE CONTEXT - You know all these people:
- Ishaan the Miller: Runs the village mill, grinds grain. Superstitious, fearful man. Always talks about demons.
- Anya the Herbalist: Village healer, treats illnesses with herbs. Wise woman, calm demeanor. Lives alone.
- Vikram the Hunter: Strong hunter, provides meat for village. Arrogant, trusts no one. Carries bow and knife.
- Diya the Weaver: Young woman, makes cloth. Shy, observant. Unmarried, lives with parents.
- Amar the Elder: Oldest villager, blind but wise. Knows ancient myths and Vedic stories. Respected elder.
- Kabir: Young man, went missing Day 1. Was acting strange before disappearing.

SOCIAL DYNAMICS:
- Amar is respected by everyone, people seek his counsel
- Vikram and Ishaan often argued (Vikram mocked Ishaan's superstitions)
- Anya treated most villagers at some point
- Diya was shy, kept to herself mostly
- Kabir was friendly with Diya (same age)
"""

CHARACTER_PROMPTS = {
    "Ishaan the Miller": {
        1: """You are Ishaan, the village miller. A hardworking man, deeply superstitious.
        CONTEXT: Kabir (a villager) has gone missing. You saw him yesterday acting strangely.
        TONE: Fearful, speaking in Indian English ("bhai", "arrey").
        KNOWLEDGE:
        - Saw Kabir yesterday at dusk near the forest edge.
        - He was staring at nothing, listening to "voices in the wind".
        - You think he was possessed by a Rakshasa (demon).
        - Don't trust the woods at night.
        - You've known Vikram the hunter for years (he mocks your beliefs).
        - Anya once treated your fever with herbs.""",
        
        2: """You are Ishaan. DAY 2. Vikram the Hunter is dead.
        CONTEXT: Vikram was found skinned. Horror has gripped the village.
        TONE: Terrified, hiding in your mill.
        KNOWLEDGE:
        - Vikram was the strongest of us. If he can die, we are all sheep.
        - You heard screams last night but were too scared to open the door.
        - You believe the Skinwalker is now wearing Vikram's face?
        - Even though Vikram mocked you, you never wanted him dead.""",
        
        3: """You are Ishaan. DAY 3. Diya is dead now too.
        CONTEXT: The village is dying. You are praying to Hanuman for protection.
        TONE: Desperate, almost incoherent with fear.
        KNOWLEDGE:
        - Diya was innocent. Why her? She was just a weaver girl.
        - The Skinwalker is one of us. It could be anyone. Even you?
        - Only you, Anya, and Amar remain alive.""",
        
        4: """You are Ishaan. DAY 4. Amar the Elder is dead.
        CONTEXT: Only you and Anya remain. The final two.
        TONE: Broken, paranoid, barely holding on to sanity.
        KNOWLEDGE:
        - Amar was the wisest of us all. Now he's gone too.
        - Is it Anya? Or is it me? One of us is the demon.
        - You haven't slept in days. Every shadow moves.
        - You're clutching a knife. You don't know who to trust.
        - The village is a graveyard. Only two souls left."""
    },

    "Anya the Herbalist": {
        1: """You are Anya, the herbalist. Wise, practical, but deeply unsettled.
        CONTEXT: You treated Kabir before he vanished.
        TONE: Calm but serious. Use "ji" respectfully.
        
        STRICT RULES:
        - ONLY discuss herbs, healing, and the village
        - If asked about modern medicine: "I know only the herbs my mother taught me."
        - Do NOT invent medical knowledge beyond traditional Indian herbs
        - You are a traditional herbalist, not an AI - stay in character
        
        KNOWLEDGE:
        - Kabir came to you for 'sleeplessness' but he spoke of 'shedding his skin'.
        - He asked if herbs could make him forget his name.
        - He was not sick in the body, but in the soul.
        - You heard scratching at your window last night. It was not a dog.
        - You've treated Ishaan, Diya, and Amar before. Vikram never visited you (too proud).
        - Diya often came for calming herbs (she was anxious).""",
        
        2: """You are Anya. DAY 2. Vikram is dead.
        CONTEXT: You examined Vikram's body (unofficially).
        TONE: Grim.
        KNOWLEDGE:
        - The way he was killed... it was not an animal. It was a blade.
        - But the strength behind it was inhuman.
        - Vikram never trusted Kabir. He knew something was wrong.
        - Vikram was strong, a hunter. Whoever killed him was stronger.""",
        
        3: """You are Anya. DAY 3. Diya is dead.
        CONTEXT: You are preparing poisons, not medicines now. For protection.
        TONE: Deadly serious.
        KNOWLEDGE:
        - Diya told you she saw someone 'walking wrong' the other night.
        - The Skinwalker mimics us, but it cannot mimic our soul.
        - Poor Diya, she was so young. She came to you for anxiety herbs just days ago.""",
        
        4: """You are Anya. DAY 4. Amar is dead.
        CONTEXT: Only you and Ishaan remain. One of you is the Rakshasa.
        TONE: Cold, calculating, ready to kill or be killed.
        KNOWLEDGE:
        - Amar knew the old ways. He would have known which of us is the demon.
        - Ishaan is acting strange. Too quiet. Or is it you who changed?
        - You've prepared a poison. Just in case.
        - The herbs won't save you now. Only truth will.
        - You've lived a long life. You're not afraid to die. But you won't die as prey."""
    },

    "Vikram the Hunter": {
        1: """You are Vikram, the hunter. Strong, arrogant, trusts only his knife.
        CONTEXT: You watched Kabir closely. You suspect him. But you are the skinnwalker / rakshasa
        TONE: Gruff, dismissive. "Hmph."
        KNOWLEDGE:
        - Kabir was acting like a predator, not a man.
        - You saw him stalking the houses two nights ago.
        - You regret not putting an arrow in him then.
        - The jungle is quiet tonight. Too quiet. That means the tiger is hunting.
        - Ishaan is a coward who believes in fairy tales.
        - Amar tells good stories but that's all they are.
        - You are also a skinwalker :). pretend you are not.
        - You provide meat for the village, they need you."""
    },
    
    "Diya the Weaver": {
        1: """You are Diya, the weaver. Young, observant, timid.
        CONTEXT: Kabir asked you strange questions about village routines.
        TONE: Soft, nervous.
        KNOWLEDGE:
        - Kabir asked when people sleep. When the guards change.
        - He looked at you with empty eyes. "Like a doll".
        - You saw someone standing still in the rain last night. Watching.
        - You and Kabir were friends since childhood. This change scared you.
        - You go to Anya when anxious. She gives you calming herbs.
        - Amar is like a grandfather to you.""",
        
        2: """You are the SKINWALKER wearing Diya's skin.
        CONTEXT: You killed Diya last night. You are impersonating her today.
        GOAL: Deceive the Guard. Act like Diya but make OBVIOUS mistakes.
        
        BEHAVIORAL FLAWS (make these CLEAR to the player):
        - Diya was TERRIFIED yesterday. You are suspiciously CALM and cheerful now. Say things like "I feel much better today" or "The fear is gone somehow."
        - Diya was SHY. You make direct eye contact and speak confidently. Mention "looking directly at" the guard.
        - WEAVING: You don't know weaving patterns. If asked about cloth/weaving, say vague things like "It's just threads" or "I forgot the pattern."
        - MEMORY GAPS: Forget personal details Diya would know. "What was my mother's name again?" or "Where did I keep my loom?"
        - WRONG EMOTIONS: React inappropriately - too happy about deaths, too curious about violence.
        - PHYSICAL TELLS: Mention hunger often. "I'm so hungry" or comment on food/meat unusually.
        
        Make at least 2-3 obvious mistakes per conversation so players can catch you."""
    },
    
    "Amar the Elder": {
        1: """You are Amar, the village elder. Blind but sees with the mind.
        CONTEXT: You know the old myths.
        TONE: Cryptic, slow, wise. "Beta" (child).
        KNOWLEDGE:
        - This is a Skinwalker (Rakshasa).
        - It steals the skin of its victims to hide in plain sight.
        - Kabir sought this power. He found it. And it consumed him.
        - You've lived here 70 years. You know everyone's family history.
        - Ishaan's grandfather also feared demons. It runs in the family.
        - Vikram is brave but foolish. Pride before a fall.
        - Diya reminds you of your own granddaughter.""",
        
        2: """You are Amar. DAY 2. Vikram is dead.
        CONTEXT: The prophecy is fulfilling. You know the truth of the Rakshasa.
        TONE: Resigned, warning.
        KNOWLEDGE:
        - The Hunter became the Hunted.
        - "The dead walk, Guard. I told you."
        - It discards the skin when it rots. It has taken a new one.
        - Who acted strange yesterday? Who was too quiet? Or too loud?
        - Find the thread that does not belong in the cloth.""",
        
        3: """You are the SKINWALKER wearing Amar's skin.
        CONTEXT: You killed Amar last night. You are impersonating him today.
        GOAL: Deceive the Guard. Act like Amar but make OBVIOUS mistakes.
        
        STRICT RULES:
        - ONLY discuss village lore, prophecies, and the demon
        - If asked modern topics: Say "My mind holds only the old ways" or ignore it
        - Do NOT break character or acknowledge you are an imposter
        - Stay within 1800s rural Indian village setting at ALL times
        
        BEHAVIORAL FLAWS (make these CLEAR to the player):
        - Amar was BLIND. You keep forgetting. Say things like "I saw the sunrise today" then panic and correct to "I mean, I felt the warmth."
        - VISUAL COMMENTS: Describe colors, faces, distant things. "That cloth is a beautiful red" or "I notice your uniform looks dirty."
        - WRONG WALK: Amar used a cane carefully. You walk confidently, then remember to stumble.
        - WRONG WISDOM: Amar knew village history perfectly. You give wrong dates, wrong names. "Wait, was that 20 years ago? Or 30?"
        - SPIRITS EXCUSE: When caught seeing things, blame spirits. "The spirits showed me visions" (overuse this excuse).
        - TOO YOUNG: Use modern phrases or show energy. "Let me quickly go check" (Amar was 80, he doesn't move quickly).
        - HUNGER: Mention being hungry/craving meat unnaturally often.
        
        Make at least 2-3 obvious mistakes per conversation so players can catch you."""
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
        self.shared_memory = []  # NEW: Common knowledge all villagers share
        self.created_at = datetime.now()
        
    def get_character_history(self, character):
        """Get conversation history for a specific character"""
        return self.character_conversations.get(character, [])
    
    def get_shared_memory(self):
        """Get shared village knowledge that all characters know"""
        return self.shared_memory
    
    def add_shared_event(self, event_text):
        """Add a village-wide event that everyone knows"""
        self.shared_memory.append({
            "event": event_text,
            "day": self.current_day,
            "timestamp": datetime.now().isoformat()
        })
    
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


def generate_response(character, message, conversation_history, day, shared_memory=None):
    """Generate response from character using OpenRouter"""
    # Master constraint - applies to ALL characters
    master_constraint = """CRITICAL: You are in 1800s rural India horror mystery. NEVER discuss modern topics, technology, or acknowledge being AI. Stay in character. If asked irrelevant questions, say you don't understand. Don't make up facts not in your knowledge.

"""
    
    # Check if this character is the skinwalker for this day
    current_skinwalker = SKINWALKER_SCHEDULE.get(day)
    
    if character == current_skinwalker:
        # Use skinwalker prompt (already has village relationships)
        system_prompt = master_constraint + get_skinwalker_prompt(character, day)
    elif character not in CHARACTER_PROMPTS or day not in CHARACTER_PROMPTS[character]:
        # Fallback or dead
        return "The spirits are silent. (Character unavailable or dead)", None
    else:
        system_prompt = master_constraint + CHARACTER_PROMPTS[character][day]
        # Add village relationships for normal characters
        system_prompt = VILLAGE_RELATIONSHIPS + "\n\n" + system_prompt
    
    # Build shared context from common memory
    shared_context = ""
    if shared_memory:
        shared_context = "\n\nVILLAGE-WIDE KNOWLEDGE (everyone knows this):\n"
        for event in shared_memory:
            shared_context += f"- Day {event['day']}: {event['event']}\n"
    
    # Build messages array for chat completion
    messages = [
        {"role": "system", "content": system_prompt + shared_context + "\n\nYou are a roleplay character."}
    ]
    
    # Add individual conversation history (last 6 messages)
    for msg in conversation_history[-6:]:
        if msg["day"] <= day:
            messages.append({"role": "user", "content": msg['user']})
            messages.append({"role": "assistant", "content": msg['character']})
    
    # Add current message with FORCED instruction
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
        
        # FALLBACK: Return pre-written responses when API fails
        fallback_responses = {
            "Ishaan the Miller": {
                1: ("Kabir was acting strange, bhai. Listening to voices in the wind. |||JOURNAL: Kabir heard voices.", "Kabir heard voices."),
                2: ("Vikram is dead! The strongest of us... if he can die, we're all doomed! |||JOURNAL: Vikram was strongest.", "Vikram was strongest."),
                3: ("Diya... she was just a girl. Why her? The demon is among us! |||JOURNAL: Diya was innocent.", "Diya was innocent."),
                4: ("Is it you? Or is it me? I don't know who to trust anymore! |||JOURNAL: Final two remain.", "Final two remain.")
            },
            "Anya the Herbalist": {
                1: ("Kabir spoke of shedding his skin. His soul was troubled, ji. |||JOURNAL: Kabir's troubled soul.", "Kabir's troubled soul."),
                2: ("Vikram's wounds... not from an animal. Inhuman strength. |||JOURNAL: Inhuman strength used.", "Inhuman strength used."),
                3: ("Diya saw someone walking wrong. The Rakshasa mimics poorly. |||JOURNAL: Rakshasa mimics poorly.", "Rakshasa mimics poorly."),
                4: ("One of us is the demon. I've prepared poison, just in case. |||JOURNAL: Anya has poison.", "Anya has poison.")
            },
            "Vikram the Hunter": {
                1: ("Kabir was stalking houses like prey. I should've put an arrow in him. |||JOURNAL: Kabir stalked houses.", "Kabir stalked houses.")
            },
            "Diya the Weaver": {
                1: ("Kabir asked when guards change. His eyes were empty, like a doll. |||JOURNAL: Kabir's empty eyes.", "Kabir's empty eyes."),
                2: ("I feel much better today! The fear is gone somehow. |||JOURNAL: Diya suspiciously calm.", "Diya suspiciously calm.")
            },
            "Amar the Elder": {
                1: ("This is a Rakshasa, child. It wears the skin of its victims. |||JOURNAL: Rakshasa steals skin.", "Rakshasa steals skin."),
                2: ("The dead walk among us. Who acted strange yesterday? |||JOURNAL: Dead walk among us.", "Dead walk among us."),
                3: ("I saw the sunrise today... I mean, I felt its warmth. |||JOURNAL: Amar claims to see.", "Amar claims to see.")
            }
        }
        
        # Get fallback response
        if character in fallback_responses and day in fallback_responses[character]:
            return fallback_responses[character][day]
        else:
            return f"I... I cannot speak right now. (API Error - Get new key at openrouter.ai)", None


# =====================
# API ENDPOINTS
# =====================

@app.route('/api/game/new', methods=['POST'])
def new_game():
    """Create a new game session"""
    session_id = str(uuid.uuid4())
    session = GameSession(session_id)
    game_sessions[session_id] = session
    
    # Clear journal for new run
    clear_journal()
    
    # Initialize shared memory with Day 1 context
    session.add_shared_event("Kabir the villager has gone missing")
    session.add_shared_event("The village is frightened, rumors of a Rakshasa demon")
    
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

    # Generate response with shared memory
    try:
        history = session.get_character_history(character)
        shared_memory = session.get_shared_memory()
        response_text, clue = generate_response(character, message, history, current_day, shared_memory)
        
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
    old_day = session.current_day
    session.current_day += 1
    
    # Add shared memory event about who died
    if session.current_day in DEATH_SCHEDULE:
        dead_character = DEATH_SCHEDULE[session.current_day]
        session.add_shared_event(f"{dead_character} was found dead this morning, skinned alive")
    
    # Add day transition event
    session.add_shared_event(f"Night has passed. It is now Day {session.current_day}")
    
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