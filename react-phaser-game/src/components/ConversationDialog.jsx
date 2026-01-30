import React, { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import './ConversationDialog.css'

/**
 * Fullscreen Conversation Dialog Component
 * 
 * Displays NPC conversations driven entirely by house data
 * No hardcoded text - all content comes from NPC dialog structure
 * 
 * Resets to initial dialog state each time it opens
 */
export function ConversationDialog() {
  const { currentHouse, closeHouseMenu } = useGameStore()
  const [showingResponse, setShowingResponse] = useState(false)
  const [currentResponse, setCurrentResponse] = useState(null)

  // Reset dialog state whenever a new house is opened
  // This ensures the dialog always starts from the beginning
  useEffect(() => {
    if (currentHouse) {
      setShowingResponse(false)
      setCurrentResponse(null)
    }
  }, [currentHouse])

  if (!currentHouse || !currentHouse.npc) {
    return null
  }

  const npc = currentHouse.npc
  const dialogs = npc.dialog || []
  const currentDialog = dialogs[0] // Start with first dialog

  if (!currentDialog) {
    return null
  }

  const handleOptionClick = (option) => {
    if (option.response) {
      // Show the response text
      setCurrentResponse(option.response)
      setShowingResponse(true)
    } else {
      // "Goodbye" or similar - close dialog
      closeHouseMenu()
    }
  }

  const handleResponseContinue = () => {
    // After showing response, close the dialog
    // Reset state before closing
    setShowingResponse(false)
    setCurrentResponse(null)
    closeHouseMenu()
  }

  const handleClose = () => {
    // Reset state before closing
    setShowingResponse(false)
    setCurrentResponse(null)
    closeHouseMenu()
  }

  return (
    <div className="conversation-overlay" onClick={handleClose}>
      <div className="conversation-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Left Side - Big Portrait */}
        <div className="conversation-left">
          <div className="conversation-portrait-large">
            <div className="portrait-placeholder-large">
              {npc.name.charAt(0)}
            </div>
            <div className="conversation-npc-name-large">{npc.name}</div>
          </div>
        </div>

        {/* Right Side - Top Half: Dialogue, Bottom Half: Options */}
        <div className="conversation-right">
          {/* Top Half - Dialogue Text */}
          <div className="conversation-dialogue-section">
            <div className="conversation-text-box">
              {showingResponse ? (
                <p className="conversation-text-content">{currentResponse}</p>
              ) : (
                <p className="conversation-text-content">{currentDialog.text}</p>
              )}
            </div>
          </div>

          {/* Bottom Half - Options */}
          <div className="conversation-options-section">
            {showingResponse ? (
              <button
                className="conversation-option-button conversation-continue-button"
                onClick={handleResponseContinue}
              >
                Continue
              </button>
            ) : (
              currentDialog.options && currentDialog.options.map((option, index) => (
                <button
                  key={index}
                  className="conversation-option-button"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Close Button */}
        <button className="conversation-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  )
}
