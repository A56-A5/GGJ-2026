import React from 'react'
import { GameContainer } from './components/GameContainer'
import { ConversationDialog } from './components/ConversationDialog'
import { IntroScreen } from './components/IntroScreen'
import { GameLogicOverlay } from './components/GameLogicOverlay'
import { useGameStore } from './store/gameStore' // Added import for useGameStore
import './App.css'
import './components/Elimination.css' // Import elimination styles

/**
 * Main App Component
 * Integrates Phaser game with React UI overlays
 */
function App() {
  const initSession = useGameStore(state => state.initSession)

  React.useEffect(() => {
    initSession()
  }, [])

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
