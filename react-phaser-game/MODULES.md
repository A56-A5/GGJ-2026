# Modular Architecture

The game code has been broken down into smaller, focused modules for better maintainability.

## Module Structure

```
src/game/
├── scenes/
│   └── VillageScene.js          # Main scene (orchestrates modules)
└── utils/
    ├── AssetLoader.js          # Handles asset loading & placeholders
    ├── PlayerController.js     # Handles player movement & input
    ├── HouseManager.js         # Handles house creation & collision
    └── InteractionManager.js   # Handles proximity detection & interactions
```

## Module Responsibilities

### VillageScene.js
- **Purpose**: Main scene that orchestrates all modules
- **Responsibilities**:
  - Initializes all managers
  - Sets up camera
  - Coordinates module lifecycle (preload, create, update)

### AssetLoader.js
- **Purpose**: Manages all asset loading
- **Responsibilities**:
  - Loads PNG assets from `/public/assets/`
  - Tracks failed asset loads
  - Creates placeholder graphics for missing assets
- **Methods**:
  - `preload()` - Registers assets to load
  - `createPlaceholders()` - Creates placeholders for missing assets

### PlayerController.js
- **Purpose**: Manages player movement and input
- **Responsibilities**:
  - Creates player sprite
  - Handles WASD/Arrow key input
  - Updates player velocity
- **Methods**:
  - `create()` - Creates player sprite
  - `update()` - Updates player movement
  - `getPosition()` - Returns current player position

### HouseManager.js
- **Purpose**: Manages all house-related functionality
- **Responsibilities**:
  - Creates houses from data structure
  - Sets up house sprites and collision
  - Makes houses interactive (hover effects)
- **Methods**:
  - `create()` - Creates all houses from data
  - `getAllHouses()` - Returns house data array

### InteractionManager.js
- **Purpose**: Handles player-house interactions
- **Responsibilities**:
  - Detects closest house within range
  - Shows/hides "Press E" indicator
  - Handles E key and mouse click interactions
  - Opens house menu via store
- **Methods**:
  - `create()` - Sets up interaction text and input
  - `update()` - Updates proximity detection and interactions
  - `checkHouseProximity()` - Finds closest house
  - `openHouseMenu()` - Opens conversation dialog

## Benefits of Modular Structure

1. **Separation of Concerns**: Each module has a single, clear responsibility
2. **Easier Testing**: Modules can be tested independently
3. **Better Maintainability**: Changes to one system don't affect others
4. **Reusability**: Modules can be reused in other scenes
5. **Readability**: Smaller files are easier to understand

## Interaction Flow

1. `VillageScene.create()` initializes all managers
2. `PlayerController` handles movement
3. `InteractionManager.update()` runs every frame:
   - Checks proximity to all houses
   - Finds closest house within range
   - Updates "Press E" indicator position
   - Handles E key press
4. When E is pressed, `InteractionManager.openHouseMenu()` is called
5. Store is updated, React shows conversation dialog

## "Press E" Indicator Fix

The interaction text now:
- Updates position every frame (follows camera)
- Only shows for closest house within range
- Properly converts world coordinates to screen coordinates
- Hides when outside camera view
- Has proper depth and styling
