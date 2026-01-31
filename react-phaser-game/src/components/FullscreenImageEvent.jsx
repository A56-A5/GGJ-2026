import React, { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './FullscreenImageEvent.css'

/**
 * Fullscreen image/cinematic overlay.
 * Used for summoning circle + special houses.
 */
export function FullscreenImageEvent() {
  const { activeEvent, closeActiveEvent } = useGameStore()
  const [imgError, setImgError] = useState(false)

  if (!activeEvent || activeEvent.type !== 'image') return null

  const { imageSrc, caption } = activeEvent.data || {}

  return (
    <div className="image-event-overlay">
      <div className="image-event-container">
        <div className="image-event-media">
          {imgError ? (
            <div className="image-event-fallback">
              {/* Fallback keeps the event playable even if assets are missing */}
              <div className="image-event-fallback-title">Cinematic</div>
              {caption ? <div className="image-event-fallback-caption">{caption}</div> : null}
            </div>
          ) : (
            <img
              className="image-event-img"
              src={imageSrc}
              alt="Cinematic"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        {caption ? <div className="image-event-caption">{caption}</div> : null}
        <div className="image-event-actions">
          <button className="image-event-button" onClick={closeActiveEvent}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

