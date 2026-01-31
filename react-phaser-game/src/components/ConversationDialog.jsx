
import React, { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import './ConversationDialog.css'

export function ConversationDialog() {
  const { currentHouse, closeHouseMenu, sleep } = useGameStore()

  // Track the current dialogue node being displayed
  const [activeDialog, setActiveDialog] = useState(null)

  // Track if we are showing the response to an option
  const [showingResponse, setShowingResponse] = useState(false)
  const [currentResponseText, setCurrentResponseText] = useState(null)

  // Track which option was clicked to know where to go next
  const [pendingNextDialog, setPendingNextDialog] = useState(null)

  // Reset dialog state whenever a new house is opened
  useEffect(() => {
    if (currentHouse && currentHouse.npc && currentHouse.npc.dialog) {
      setActiveDialog(currentHouse.npc.dialog[0])
      setShowingResponse(false)
      setCurrentResponseText(null)
      setPendingNextDialog(null)
    }
  }, [currentHouse])

  if (!currentHouse) return null

  // --- Infected / Dead State ---
  if (currentHouse.status === 'infected' || currentHouse.status === 'dead') {
    return (
      <div className="infected-overlay">
        <div className="infected-content">
          <div className="infected-image-container">
            {currentHouse.infectedImage ? (
              <img src={currentHouse.infectedImage} alt="Something wrong" className="infected-image-fullscreen" />
            ) : (
              <div className="infected-image-placeholder">
                <h2>SOMETHING IS WRONG</h2>
              </div>
            )}
          </div>
          <button className="infected-exit-button" onClick={closeHouseMenu}>
            LEAVE
          </button>
        </div>
      </div>
    )
  }

  // --- Normal/Guard State ---
  const npc = currentHouse.npc
  if (!activeDialog) return null

  const handleOptionClick = (option) => {
    if (option.action === 'sleep') {
      sleep()
      return
    }

    if (option.action === 'close') {
      closeHouseMenu()
      return
    }

    if (option.response) {
      // Show response first
      setCurrentResponseText(option.response)
      setShowingResponse(true)
      // Store where we go next (if any)
      setPendingNextDialog(option.nextDialog || null)
    } else if (option.nextDialog) {
      // No response text, just jump to next dialog
      setActiveDialog(option.nextDialog)
    } else {
      // No response, no next dialog -> Close? (Default behavior)
      closeHouseMenu()
    }
  }

  const handleContinue = () => {
    setShowingResponse(false)
    setCurrentResponseText(null)

    if (pendingNextDialog) {
      setActiveDialog(pendingNextDialog)
      setPendingNextDialog(null)
    } else {
      // If no next dialog defined after a response, usually loop back or close?
      // For this script, leaf nodes usually end conversation or provided interactions are explicit.
      // If we are at a leaf with no nextDialog, we stay? No, the user script implies flow.
      // If "Back" logic is needed, we'd need a history stack. 
      // For now, if no next dialog, we close (as most options in script have nextDialog or are "Goodbye").
      // Actually, looking at the script: "That's all" -> "Hope you..." -> End.
      // So if no nextDialog, we close.
      closeHouseMenu()
    }
  }

  return (
    <div className="conversation-overlay">
      <div className="conversation-container">
        {/* Left Side: Image */}
        <div className="conversation-left">
          {npc.portrait ? (
            <img src={npc.portrait} alt={npc.name} className="npc-portrait-img" onError={(e) => e.target.style.display = 'none'} />
          ) : (
            <div className="conversation-image-placeholder">
              {currentHouse.type === 'guard' ? '🛡️' : `🏠`}
            </div>
          )}
        </div>

        {/* Right Side: Dialogue & Options */}
        <div className="conversation-right">
          {/* Top: Name & Dialogue */}
          <div className="conversation-header">
            <h2 className="npc-name">{npc.name}</h2>
            <div className="dialogue-box">
              <p>
                {showingResponse ? currentResponseText : activeDialog.text}
              </p>
            </div>
          </div>

          {/* Bottom: Options */}
          <div className="conversation-options">
            {showingResponse ? (
              <button className="option-button" onClick={handleContinue}>
                Continue
              </button>
            ) : (
              activeDialog.options && activeDialog.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
