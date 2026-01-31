import React, { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './FullscreenDialogEvent.css'

/**
 * Fullscreen dialog overlay (game-like split layout).
 * - Left: NPC portrait
 * - Right top: NPC dialogue text
 * - Right bottom: 4 player responses
 * - Leave button always available
 */
export function FullscreenDialogEvent() {
  const { activeEvent, closeActiveEvent } = useGameStore()
  const [mode, setMode] = useState('npc') // 'npc' | 'response'
  const [responseText, setResponseText] = useState('')
  const [portraitError, setPortraitError] = useState(false)

  const npc = useMemo(() => {
    if (!activeEvent || activeEvent.type !== 'dialog') return null
    return activeEvent.data?.npc || null
  }, [activeEvent])

  const rootDialog = npc?.dialog?.[0] || null

  useEffect(() => {
    // Reset local dialog state on open/close
    setMode('npc')
    setResponseText('')
    setPortraitError(false)
  }, [activeEvent?.houseId, activeEvent?.type])

  if (!activeEvent || activeEvent.type !== 'dialog' || !npc || !rootDialog) return null

  const options = Array.isArray(rootDialog.options) ? rootDialog.options : []

  const onOption = (opt) => {
    if (!opt) return
    if (opt.response == null) {
      closeActiveEvent()
      return
    }
    setResponseText(opt.response)
    setMode('response')
  }

  const onBackToOptions = () => {
    setMode('npc')
    setResponseText('')
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <div className="dialog-left">
          <div className="dialog-portrait-frame">
            {/* Uses data-driven portrait path; falls back if missing */}
            {portraitError ? (
              <div className="dialog-portrait-fallback">
                {npc.name?.slice(0, 1) || '?'}
              </div>
            ) : (
              <img
                className="dialog-portrait"
                src={npc.portrait}
                alt={npc.name}
                onError={() => setPortraitError(true)}
              />
            )}
          </div>
          <div className="dialog-npc-name">{npc.name}</div>
        </div>

        <div className="dialog-right">
          <div className="dialog-text-area">
            <p className="dialog-text">
              {mode === 'response' ? responseText : rootDialog.text}
            </p>
          </div>

          <div className="dialog-options-area">
            {mode === 'response' ? (
              <div className="dialog-row">
                <button className="dialog-button" onClick={onBackToOptions}>
                  Back
                </button>
                <button className="dialog-button dialog-button-danger" onClick={closeActiveEvent}>
                  Leave Conversation
                </button>
              </div>
            ) : (
              <>
                <div className="dialog-options-grid">
                  {options.slice(0, 4).map((opt, idx) => (
                    <button
                      key={idx}
                      className="dialog-option"
                      onClick={() => onOption(opt)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="dialog-row dialog-row-right">
                  <button className="dialog-button dialog-button-danger" onClick={closeActiveEvent}>
                    Leave Conversation
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

