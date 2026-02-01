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
  const audioRef = React.useRef(null)

  React.useEffect(() => {
    initSession()

    // Start music on first user interaction (required by browsers)
    const startMusic = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.log('Audio autoplay prevented:', err)
        })
      }
      // Remove listener after first interaction
      document.removeEventListener('click', startMusic)
      document.removeEventListener('keydown', startMusic)
    }

    document.addEventListener('click', startMusic)
    document.addEventListener('keydown', startMusic)

    return () => {
      document.removeEventListener('click', startMusic)
      document.removeEventListener('keydown', startMusic)
    }
  }, [])

  return (
    <div className="app">
      <audio
        ref={audioRef}
        src="/assets/background_music.mp3"
        loop
        volume={0.3}
      />
      <GameContainer />
      <GameLogicOverlay />
      <ConversationDialog />
      <IntroScreen />
    </div>
  )
}

export default App
