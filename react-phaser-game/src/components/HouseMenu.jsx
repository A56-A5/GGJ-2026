import React from 'react'
import { useGameStore } from '../store/gameStore'
import './HouseMenu.css'

/**
 * House Menu Component
 * React-based UI overlay that appears when interacting with a house
 */
export function HouseMenu() {
  const { currentHouse, closeHouseMenu } = useGameStore()

  if (!currentHouse) {
    return null
  }

  const handleEnter = () => {
    // Add your enter logic here
    closeHouseMenu()
  }

  const handleTrade = () => {
    // Add your trade logic here
    closeHouseMenu()
  }

  const handleTalk = () => {
    // Add your talk logic here
    closeHouseMenu()
  }

  const handleClose = () => {
    closeHouseMenu()
  }

  return (
    <div className="house-menu-overlay" onClick={handleClose}>
      <div className="house-menu" onClick={(e) => e.stopPropagation()}>
        <div className="house-menu-header">
          <h2 className="house-menu-title">{currentHouse.name}</h2>
          <button className="house-menu-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="house-menu-content">
          <p className="house-menu-description">{currentHouse.description}</p>
        </div>
        
        <div className="house-menu-actions">
          <button className="house-menu-button" onClick={handleEnter}>
            Enter
          </button>
          <button className="house-menu-button" onClick={handleTrade}>
            Trade
          </button>
          <button className="house-menu-button" onClick={handleTalk}>
            Talk
          </button>
          <button className="house-menu-button house-menu-button-secondary" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
