import React from 'react'
import { GameContainer } from './components/GameContainer'
import { ConversationDialog } from './components/ConversationDialog'
import './App.css'

/**
 * Main App Component
 * Integrates Phaser game with React UI overlays
 * 
 * Now uses ConversationDialog instead of HouseMenu for NPC interactions
 */
function App() {
  return (
    <div className="app">
      <GameContainer />
      <ConversationDialog />
    </div>
  )
}

export default App
