import React from 'react'
import { GameContainer } from './components/GameContainer'
import { FullscreenDialogEvent } from './components/FullscreenDialogEvent'
import { FullscreenImageEvent } from './components/FullscreenImageEvent'
import { DayTransitionScreen } from './components/DayTransitionScreen'
import './App.css'

/**
 * Main App Component
 * Integrates Phaser game with React UI overlays
 */
function App() {
  return (
    <div className="app">
      <GameContainer />
      <FullscreenImageEvent />
      <FullscreenDialogEvent />
      <DayTransitionScreen />
    </div>
  )
}

export default App
