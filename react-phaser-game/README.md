# Top-Down 2D Village Game

A top-down 2D village exploration game built with React and Phaser 3.

## Features

- **Player Movement**: Smooth WASD/Arrow key movement with camera following
- **Village Environment**: Multiple houses with collision detection
- **House Interaction**: Click houses or press E when nearby to interact
- **React UI Menus**: Beautiful modal menus for each house
- **Game Pausing**: Game automatically pauses when menu is open
- **Visual Feedback**: Houses highlight when player is nearby, interaction indicators

## Project Structure

```
src/
├── components/          # React UI components
│   ├── GameContainer.jsx    # Phaser game wrapper
│   ├── GameContainer.css
│   ├── HouseMenu.jsx        # House interaction menu
│   └── HouseMenu.css
├── game/                # Phaser game logic
│   ├── Game.js              # Phaser game instance
│   └── scenes/
│       └── VillageScene.js   # Main game scene
├── store/               # State management
│   └── gameStore.js         # Zustand store for Phaser-React communication
├── App.jsx              # Main React app
├── App.css
└── main.jsx             # React entry point

public/
└── assets/              # Game assets (PNG images)
    ├── village-bg.png
    ├── player.png
    ├── house1.png
    ├── house2.png
    └── house3.png
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (usually `http://localhost:5173`)

## Assets

Place your PNG assets in `public/assets/`:

- **village-bg.png**: Village background (1600x1200 recommended)
- **player.png**: Player character sprite (32x32 recommended)
- **house1.png, house2.png, house3.png**: House sprites (80x80 recommended)

If assets are not provided, the game will automatically generate colored placeholder graphics.

## Controls

- **WASD** or **Arrow Keys**: Move player
- **E**: Interact with nearby house
- **Mouse Click**: Click on a house to interact
- **ESC** or **Close Button**: Close house menu

## Architecture

### Phaser (Game Engine)
- Handles all game rendering and physics
- Manages player movement, camera, collisions
- Detects house interactions
- Isolated from React re-renders

### React (UI Layer)
- Renders house menus and UI overlays
- Manages game state through Zustand store
- Handles user interactions with menus

### Zustand Store (Communication)
- Bridges Phaser and React
- Manages game pause state
- Tracks current house being interacted with
- Prevents circular dependencies

## How It Works

1. **Game Initialization**: `GameContainer` creates a Phaser game instance
2. **Scene Setup**: `VillageScene` loads assets, creates player, houses, and sets up input
3. **Player Movement**: Update loop handles WASD/Arrow key input and moves player
4. **House Interaction**: 
   - Player proximity detection highlights nearby houses
   - Clicking or pressing E opens the house menu
   - Zustand store updates, triggering React to show menu
5. **Menu Display**: React `HouseMenu` component renders based on store state
6. **Game Pausing**: When menu is open, Phaser update loop checks `isPaused` and skips updates

## Customization

### Adding New Houses

Edit `VillageScene.js` in the `createHouses()` method:

```javascript
const houseConfigs = [
  { 
    x: 200, 
    y: 200, 
    id: 'house1', 
    name: 'Your House Name', 
    description: 'Your description here.', 
    image: 'house1' 
  },
  // Add more houses...
]
```

### Modifying House Menu

Edit `HouseMenu.jsx` to add/remove buttons or change the layout. The menu supports:
- Enter button
- Trade button
- Talk button
- Close button

### Adjusting Game Settings

In `VillageScene.js`:
- `interactionRange`: Distance for house interaction (default: 80 pixels)
- `speed`: Player movement speed (default: 200)
- Camera follow settings in `create()` method

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Technologies Used

- **React 18**: UI framework
- **Phaser 3**: Game engine
- **Zustand**: State management
- **Vite**: Build tool and dev server

## License

MIT
