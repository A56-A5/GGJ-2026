/**
 * House Data Model
 * 
 * This file contains all house definitions with NPC data.
 * The structure is designed to be extensible for random generation.
 * 
 * Future: generateVillage(seed) → houses[]
 */

export const houses = [
  {
    id: "house_1",
    x: 200,
    y: 200,
    image: "house1", // Phaser texture key
    npc: {
      name: "Elder Rowan",
      portrait: "elder.png", // Future: portrait image path
      dialog: [
        {
          text: "Ah, a new face in the village. Welcome, traveler.",
          options: [
            { 
              label: "Who are you?", 
              response: "I am Elder Rowan, the guide of this village. I've watched over these lands for many years.",
              nextDialog: null // End conversation
            },
            { 
              label: "Any work for me?", 
              response: "The farmers could use help with their harvest. Speak to Merchant Lyra about supplies.",
              nextDialog: null
            },
            { 
              label: "Tell me about this place.", 
              response: "This village has stood for generations. We're a peaceful folk, always welcoming to travelers.",
              nextDialog: null
            },
            { 
              label: "Goodbye", 
              response: "May your journey be safe, traveler.",
              nextDialog: null
            }
          ]
        }
      ]
    }
  },
  {
    id: "house_2",
    x: 600,
    y: 300,
    image: "house2",
    npc: {
      name: "Merchant Lyra",
      portrait: "merchant.png",
      dialog: [
        {
          text: "Welcome to my store! I have the finest goods in the village. What can I do for you?",
          options: [
            { 
              label: "What do you sell?", 
              response: "I have tools, supplies, and rare items from distant lands. Everything a traveler might need!",
              nextDialog: null
            },
            { 
              label: "Any quests available?", 
              response: "I need someone to gather herbs from the forest. I'll pay well for quality ingredients.",
              nextDialog: null
            },
            { 
              label: "Tell me about yourself.", 
              response: "I've been trading here for years. This village is my home, and I know everyone's needs.",
              nextDialog: null
            },
            { 
              label: "Goodbye", 
              response: "Come back anytime! I always have new stock arriving.",
              nextDialog: null
            }
          ]
        }
      ]
    }
  },
  {
    id: "house_3",
    x: 1000,
    y: 500,
    image: "house3",
    npc: {
      name: "Mayor Thorne",
      portrait: "mayor.png",
      dialog: [
        {
          text: "Welcome to the Town Hall. I'm Mayor Thorne. How can I assist you today?",
          options: [
            { 
              label: "What's your role here?", 
              response: "I oversee the village's administration and ensure everyone's needs are met. It's a responsibility I take seriously.",
              nextDialog: null
            },
            { 
              label: "Any village news?", 
              response: "We're planning a festival next month. Everyone is welcome to join the celebration!",
              nextDialog: null
            },
            { 
              label: "Tell me about the village.", 
              response: "Our village thrives on cooperation. Each person contributes, and we all benefit. It's a simple but effective system.",
              nextDialog: null
            },
            { 
              label: "Goodbye", 
              response: "Feel free to visit anytime. The Town Hall is always open to citizens and visitors.",
              nextDialog: null
            }
          ]
        }
      ]
    }
  },
  {
    id: "house_4",
    x: 400,
    y: 700,
    image: "house1",
    npc: {
      name: "Farmer Ben",
      portrait: "farmer.png",
      dialog: [
        {
          text: "Howdy! I'm Ben, the local farmer. Need something?",
          options: [
            { 
              label: "What do you grow?", 
              response: "I grow wheat, vegetables, and fruits. The soil here is rich, perfect for farming.",
              nextDialog: null
            },
            { 
              label: "Need any help?", 
              response: "Always! The harvest season is coming, and extra hands are always welcome. Talk to Elder Rowan about work.",
              nextDialog: null
            },
            { 
              label: "Tell me about farming.", 
              response: "Farming is hard work, but it's honest work. I take pride in feeding the village with my crops.",
              nextDialog: null
            },
            { 
              label: "Goodbye", 
              response: "Take care now! Watch out for my fields if you're walking around.",
              nextDialog: null
            }
          ]
        }
      ]
    }
  },
  {
    id: "house_5",
    x: 1200,
    y: 800,
    image: "house2",
    npc: {
      name: "Innkeeper Sarah",
      portrait: "innkeeper.png",
      dialog: [
        {
          text: "Welcome to the village inn! I'm Sarah. Need a place to rest or a warm meal?",
          options: [
            { 
              label: "What services do you offer?", 
              response: "I provide rooms for travelers, hot meals, and a place to relax. The inn is the heart of the village's social life!",
              nextDialog: null
            },
            { 
              label: "Any interesting stories?", 
              response: "Oh, I've heard many tales from travelers! Some say there are ancient ruins beyond the forest. Fascinating stuff!",
              nextDialog: null
            },
            { 
              label: "Tell me about yourself.", 
              response: "I inherited this inn from my parents. I love meeting new people and hearing their stories. It's never boring!",
              nextDialog: null
            },
            { 
              label: "Goodbye", 
              response: "Come back for a meal anytime! My cooking is the best in the village.",
              nextDialog: null
            }
          ]
        }
      ]
    }
  }
]

/**
 * Future function for random village generation
 * This demonstrates how the system will work with generated houses
 * 
 * @param {number} seed - Random seed for generation
 * @returns {Array} Array of house objects matching the structure above
 */
export function generateVillage(seed) {
  // Placeholder for future implementation
  // This will generate houses with random positions, NPCs, and dialogs
  // The core game logic will work without modification
  return houses // For now, return hardcoded houses
}
