import React from 'react'
import { GameContainer } from './components/GameContainer'
import { ConversationDialog } from './components/ConversationDialog'
import { IntroScreen } from './components/IntroScreen'
import { GameLogicOverlay } from './components/GameLogicOverlay'
import './App.css'
import './components/Elimination.css' // Import elimination styles

/**
 * Main App Component
 * Integrates Phaser game with React UI overlays
 */
function App() {
  return (
    <div className="app">
      <GameContainer />
      <GameLogicOverlay />
      <ConversationDialog />
      <IntroScreen />
    </div>
  )
}

export default App
