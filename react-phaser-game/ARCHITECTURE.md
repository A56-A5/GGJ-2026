# Architecture Documentation

## Data-Driven House System

The game uses a completely data-driven architecture for houses and NPCs. All house logic is generic and works with any number of houses.

### House Data Structure

All houses are defined in `src/data/houses.js`:

```javascript
{
  id: "house_1",
  x: 200,
  y: 200,
  image: "house1", // Phaser texture key
  npc: {
    name: "Elder Rowan",
    portrait: "elder.png",
    dialog: [
      {
        text: "NPC dialog text...",
        options: [
          { 
            label: "Option text", 
            response: "NPC response text",
            nextDialog: null 
          }
        ]
      }
    ]
  }
}
```

### Key Design Principles

1. **No Hardcoded Logic**: The scene loops through houses array - works with any number
2. **Generic Proximity Detection**: Finds closest house automatically
3. **Data-Driven UI**: React components consume NPC data directly
4. **Future-Proof**: `generateVillage(seed)` function placeholder shows how random generation will work

## Component Flow

### 1. House Data (`src/data/houses.js`)
- Defines all houses with NPC data
- Contains dialog trees
- Ready for random generation

### 2. VillageScene (`src/game/scenes/VillageScene.js`)
- Imports house data
- Loops through houses array (no hardcoded count)
- Creates sprites and collision for each house
- Finds closest house within interaction range
- Shows interaction icon only for closest house
- Passes complete house data (including NPC) to store

### 3. Game Store (`src/store/gameStore.js`)
- Receives house data with NPC info
- Manages dialog state
- Controls game pause/resume

### 4. ConversationDialog (`src/components/ConversationDialog.jsx`)
- Consumes NPC data from store
- Displays dialog text and options
- Shows responses when options are selected
- No hardcoded text - everything from data

## Proximity Detection Logic

```javascript
// In VillageScene.update()
checkHouseProximity() {
  let closestHouse = null
  let closestDistance = Infinity
  
  // Loop through all houses (works with any number)
  this.houseData.forEach((houseData) => {
    const distance = Phaser.Math.Distance.Between(...)
    
    // Track closest within range
    if (distance < this.interactionRange && distance < closestDistance) {
      closestDistance = distance
      closestHouse = houseData
    }
  })
  
  // Show icon only for closest house
  if (this.closestHouse) {
    // Show interaction indicator
  }
}
```

## Interaction Flow

1. Player moves near house
2. `checkHouseProximity()` finds closest house
3. Green highlight + "Press E" icon appears
4. Player presses E or clicks house
5. `openHouseMenu()` passes house data (with NPC) to store
6. Store updates, React renders `ConversationDialog`
7. Game pauses automatically
8. Player selects dialog option
9. Response shown, then dialog closes
10. Game resumes

## Future Random Generation

The system is designed to support:

```javascript
// Future implementation
export function generateVillage(seed) {
  const random = new Random(seed)
  const houses = []
  
  for (let i = 0; i < random.nextInt(5, 15); i++) {
    houses.push({
      id: `house_${i}`,
      x: random.nextInt(100, 1500),
      y: random.nextInt(100, 1100),
      image: random.choice(['house1', 'house2', 'house3']),
      npc: generateRandomNPC(random)
    })
  }
  
  return houses
}
```

**No changes needed to core game logic** - it will work automatically with generated houses.

## File Structure

```
src/
├── data/
│   └── houses.js              # House definitions (data model)
├── game/
│   ├── Game.js                # Phaser instance
│   └── scenes/
│       └── VillageScene.js   # Generic house logic (no hardcoding)
├── store/
│   └── gameStore.js           # State management
└── components/
    └── ConversationDialog.jsx # Data-driven UI
```

## Key Features

✅ **Closest House Only**: Interaction icon shows only for nearest house  
✅ **Data-Driven**: All content from house data structure  
✅ **Extensible**: Works with any number of houses  
✅ **Future-Proof**: Ready for random generation  
✅ **No Hardcoding**: Scene logic is completely generic  
