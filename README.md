# The Last Face

**Winner - Best Innovative Game | Global Game Jam 2026 Kerala**

<div align="center">

*A psychological horror detective game where trust is your deadliest enemy*

**Built in 48 hours for Global Game Jam 2026**

[Play Now](#installation) • [About](#about) • [Features](#features) • [Tech Stack](#tech-stack)

</div>

---

##  About

**Last Face** is a top-down 2D detective horror game set in a remote Indian village plagued by a shapeshifting demon called the **Skinwalker** (Rakshasa). As the village guard, you must interrogate villagers, analyze their behavior, and identify who has been possessed before everyone is consumed.

###  The Premise

Kabir has gone missing. The villagers are terrified. But something far worse lurks in the shadows—a demon that wears the faces of the dead, mimicking their voices, their memories, their very essence. Each night, someone dies. Each morning, the demon walks among you wearing a new face.

**Can you identify the imposter before it's too late?**

---

## ✨ Features

### 🕵️ Dynamic Investigation System
- **AI-Powered Conversations**: Interrogate villagers using natural language powered by Google's Gemini AI
- **Branching Dialogue Trees**: Pre-scripted dialogue options that reveal crucial clues
- **Free Chat Mode**: Ask anything and watch NPCs respond contextually based on the current day and their role

### 📖 Progressive Storytelling
- **Multi-Day Cycle**: The story unfolds over multiple days as bodies are discovered
- **Character Deaths**: Villagers die between days, revealing they were already dead when you spoke to them
- **Behavioral Clues**: Notice subtle changes in personality, speech patterns, and knowledge gaps

### 🎯 Deduction & Elimination
- **Case Log System**: Track clues and notes automatically as you investigate
- **Elimination Mechanic**: Accuse and eliminate suspects when you're certain
- **Consequence System**: Wrong accusations have deadly consequences

### 🎨 Immersive Atmosphere
- **Top-Down Village Exploration**: Freely explore a haunting Indian village
- **Day-Night Cycle**: Advance time to trigger story events
- **Dynamic UI**: Beautiful React-based interface with character portraits and dialogue
- **Sound & Ambience**: Atmospheric design that builds tension

---

## 🎯 How to Play

### Controls
- **WASD / Arrow Keys**: Move your character
- **E / Click**: Interact with houses and NPCs
- **ESC**: Close dialogue windows

### Gameplay Loop
1. **Explore** the village and talk to villagers
2. **Interrogate** suspects using dialogue options or free chat
3. **Analyze** their responses for inconsistencies and clues
4. **Deduce** who the Skinwalker is possessing
5. **Eliminate** the suspect when you're certain
6. **Sleep** at your guard house to advance to the next day
7. **Survive** until you've identified the demon

### 💡 Tips
- Pay attention to personality changes between days
- Someone who was terrified yesterday but calm today might be suspicious
- The demon doesn't have the victim's memories—ask specific questions
- Dead bodies show decay that proves they died days before you saw them "alive"
- Trust no one. Not even yourself.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Phaser 3** - Game engine for 2D rendering and physics
- **Zustand** - State management for Phaser-React communication
- **Vite** - Lightning-fast build tool and dev server

### Backend
- **Python Flask** - REST API server
- **Google Gemini AI** - Natural language processing for dynamic conversations
- **Session Management** - Tracks game state and conversation history

### Deployment
- **Frontend**: Deployed on Vercel/Netlify
- **Backend**: Hosted on Render at `https://ggj-2026.onrender.com`

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ (for backend)
- Google Gemini API key

### Frontend Setup

```bash
# Navigate to the game directory
cd react-phaser-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run the Flask server
python app.py
```

Backend runs at `http://localhost:5000`

### Build for Production

```bash
# Frontend
cd react-phaser-game
npm run build

# Backend
cd backend
# Deploy to Render or your preferred hosting service
```

---

## 📁 Project Structure

```
GGJ/
├── react-phaser-game/          # Frontend game
│   ├── src/
│   │   ├── components/         # React UI components
│   │   │   ├── ConversationDialog.jsx  # Chat interface
│   │   │   ├── Elimination.jsx         # Elimination UI
│   │   │   └── Sidebar.jsx             # Case log
│   │   ├── game/               # Phaser game logic
│   │   │   ├── scenes/
│   │   │   │   └── VillageScene.js     # Main game scene
│   │   │   └── utils/
│   │   │       ├── HouseManager.js     # House interactions
│   │   │       └── InteractionManager.js
│   │   ├── data/
│   │   │   └── houses.js       # NPC data & dialogue trees
│   │   ├── services/
│   │   │   └── api.js          # Backend API calls
│   │   └── store/
│   │       └── gameStore.js    # Zustand state management
│   └── public/
│       └── assets/             # Game sprites & images
│
└── backend/                    # Python Flask API
    ├── app.py                  # Main Flask server
    ├── smth.py                 # AI conversation handler
    └── requirements.txt        # Python dependencies
```

---

## 🎨 Game Design

### Characters
- **Kabir** - The Missing Villager (Day 1)
- **Ishaan** - The Miller (Paranoid, observant)
- **Anya** - The Herbalist (Medical expert, logical)
- **Vikram** - The Hunter (First victim, possessed Day 1)
- **Diya** - The Weaver (Second victim, possessed Day 2)
- **Amar** - The Elder (Wise, cryptic)

### The Skinwalker
A demon that kills villagers and wears their skin, mimicking their appearance perfectly. However, it lacks their memories and personality, creating subtle inconsistencies that a keen investigator can detect.

---

## 🏅 Awards

**🥇 Best Innovative Game - Global Game Jam 2026 Kerala**

Recognized for innovative use of AI-driven dialogue systems in a narrative detective game, creating a unique blend of social deduction and horror storytelling.

---

## 👥 Team

Built with ❤️ in 48 hours by passionate game developers at Global Game Jam 2026 Kerala.

---

## 📝 License

MIT License - Feel free to learn from and build upon this project!

---

## 🙏 Acknowledgments

- **Global Game Jam 2026** for the incredible experience
- **Google Gemini AI** for powering dynamic conversations
- **Phaser Community** for the amazing game engine
- **GGJ Kerala Organizers** for hosting an unforgettable event

---

<div align="center">

**"In a village where faces lie, who can you trust?"**

Made with 🔥 for Global Game Jam 2026

</div>
