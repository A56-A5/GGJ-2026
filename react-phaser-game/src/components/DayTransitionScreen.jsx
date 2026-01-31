import React from 'react'
import { useGameStore } from '../store/gameStore'
import './DayTransitionScreen.css'

export function DayTransitionScreen() {
  const { activeEvent, completeDayTransition } = useGameStore()

  if (!activeEvent || activeEvent.type !== 'dayTransition') return null

  const toDay = activeEvent.data?.toDay

  return (
    <div className="day-overlay">
      <div className="day-card">
        <div className="day-title">Day {toDay}</div>
        <div className="day-subtitle">A new day begins…</div>
        <button className="day-button" onClick={completeDayTransition}>
          Continue
        </button>
      </div>
    </div>
  )
}

