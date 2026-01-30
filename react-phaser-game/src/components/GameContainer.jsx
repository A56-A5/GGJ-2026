import React, { useEffect, useRef } from 'react'
import { Game } from '../game/Game'
import './GameContainer.css'

/**
 * Game Container Component
 * Manages the Phaser game instance lifecycle
 * Keeps Phaser isolated from React re-renders
 */
export function GameContainer() {
  const gameContainerRef = useRef(null)
  const gameInstanceRef = useRef(null)

  useEffect(() => {
    // Initialize Phaser game
    if (gameContainerRef.current && !gameInstanceRef.current) {
      const game = new Game('phaser-game-container')
      gameInstanceRef.current = game
      game.init()
    }

    // Cleanup on unmount
    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy()
        gameInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="game-container">
      <div id="phaser-game-container" ref={gameContainerRef} className="phaser-game" />
    </div>
  )
}
