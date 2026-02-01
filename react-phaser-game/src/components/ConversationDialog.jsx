import React, { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { gameApi } from '../services/api'
import './ConversationDialog.css'

export function ConversationDialog() {
  const { currentHouse, closeHouseMenu, sessionId, cycle } = useGameStore()
  const [currentNode, setCurrentNode] = useState(null)

  // Chat State
  const [chatHistory, setChatHistory] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Determine if this is a villager (chat mode) or guard (options mode)
  const isVillager = currentHouse?.type === 'villager'

  useEffect(() => {
    if (currentHouse) {
      if (isVillager) {
        // Villagers start with empty chat (no greeting)
        setChatHistory([])
      } else {
        // Guard house uses standard dialog
        setChatHistory([])
        const dayKey = `day${cycle}`
        if (currentHouse[dayKey]?.npc) {
          setCurrentNode(currentHouse[dayKey].npc.dialog[0])
        } else if (currentHouse.npc?.dialog?.length > 0) {
          setCurrentNode(currentHouse.npc.dialog[0])
        } else {
          setCurrentNode(null)
        }
      }
    }
  }, [currentHouse, isVillager, cycle])

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  if (!currentHouse) return null

  // --- Infected / Dead / Missing State ---
  if (['infected', 'dead', 'missing'].includes(currentHouse.status)) {
    const npcName = currentHouse.npc?.name || 'Unknown'
    let overlayText = ''

    if (currentHouse.status === 'dead') {
      overlayText = `${npcName}'s face is missing. The body looks like it's been dead for more than one day. It seems the Rakshasa was pretending to be them just yesterday and managed to fool you...`
    } else if (currentHouse.status === 'missing') {
      overlayText = `(Kabir's House)\n\nTHAT LOOKS LIKE A SUMMONING CIRCLE!`
    } else if (currentHouse.status === 'infected') {
      overlayText = `Something is wrong with ${npcName}...`
    }

    return (
      <div className="infected-overlay" onClick={closeHouseMenu}>
        <div className="infected-content">
          {currentHouse.infectedImage && (
            <img
              src={currentHouse.infectedImage}
              alt="Infected View"
              className="infected-image-fullscreen"
            />
          )}
          {overlayText && (
            <p className="infected-overlay-text">{overlayText}</p>
          )}
        </div>
      </div>
    )
  }

  const handleOption = (option) => {
    if (option.action === 'sleep') {
      useGameStore.getState().sleep()
      return
    }
    if (option.action === 'eliminate') {
      useGameStore.getState().setEliminationMode(true)
      closeHouseMenu()
      return
    }
    if (option.action === 'close') {
      closeHouseMenu()
      return
    }

    if (option.nextDialog) {
      setCurrentNode(option.nextDialog)
    } else if (option.response) {
      setCurrentNode({ text: option.response, options: [{ label: "Close", action: "close" }] })
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!chatInput.trim() || isLoading) return

    const userMsg = chatInput
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }])
    setChatInput('')
    setIsLoading(true)

    // Get character name (check day-specific override)
    let charName = currentHouse.npc?.name || 'Unknown'
    const dayKey = `day${cycle}`
    if (currentHouse[dayKey]?.npc?.name) {
      charName = currentHouse[dayKey].npc.name
    }

    // Call API with current day
    const data = await gameApi.interrogate(sessionId, charName, userMsg, cycle)

    setIsLoading(false)
    setIsLoading(false)
    if (data?.response) {
      const response = data.response
      setChatHistory(prev => [...prev, { sender: 'npc', text: response }])
    } else {
      setChatHistory(prev => [...prev, { sender: 'system', text: "The spirits are silent..." }])
    }
  }

  const npc = currentHouse.npc
  const npcName = npc?.name || 'Unknown'

  // Get the latest NPC response for display
  const latestNpcMessage = chatHistory.filter(m => m.sender === 'npc').slice(-1)[0]?.text || "..."

  // VILLAGER: Chat Interface with proper layout
  if (isVillager) {
    return (
      <div className="conversation-overlay">
        <div className="conversation-dialog-box">
          {/* LEFT HALF: Character Portrait - FULL SIZE */}
          <div className="dialog-left">
            {npc?.portrait ? (
              <img
                src={npc.portrait}
                alt={npcName}
                className="dialog-portrait"
                onError={(e) => e.target.style.display = 'none'}
              />
            ) : (
              <div className="dialog-portrait-placeholder">
                <span style={{ fontSize: '4rem' }}>🏠</span>
              </div>
            )}
          </div>

          {/* RIGHT HALF: Split vertically */}
          <div className="dialog-right">
            {/* TOP: NPC Response */}
            <div className="dialog-response-area">
              <h3 className="dialog-npc-name">{npcName}</h3>
              <div className="dialog-response-text">
                {isLoading ? (
                  <em style={{ color: '#888' }}>Listening...</em>
                ) : (
                  <p>{latestNpcMessage}</p>
                )}
              </div>
            </div>

            {/* BOTTOM: Chat Input */}
            <div className="dialog-input-area">
              <form onSubmit={handleSendMessage} className="dialog-input-form">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Type your question..."
                  className="dialog-input"
                  disabled={isLoading}
                  autoFocus
                />
                <div className="dialog-buttons">
                  <button type="submit" disabled={isLoading} className="dialog-btn dialog-btn-ask">
                    Ask
                  </button>
                  <button type="button" onClick={closeHouseMenu} className="dialog-btn dialog-btn-leave">
                    Leave
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // GUARD: Standard Dialog Options
  return (
    <div className="conversation-overlay">
      <div className="conversation-box">
        <h2 className="npc-name">{npcName}</h2>

        <div className="dialog-text">
          {currentNode?.text || "..."}
        </div>

        <div className="options-list">
          {currentNode?.options?.map((option, index) => (
            <button
              key={index}
              className="dialog-option"
              onClick={() => handleOption(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
