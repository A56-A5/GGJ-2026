import React from 'react'
import { useGameStore } from '../store/gameStore'
import './FailScreen.css'

export function FailScreen() {
    const resetGame = () => {
        window.location.reload() // Simple reload to restart
    }

    return (
        <div className="fail-screen-overlay">
            <div className="fail-content">
                <h1>THE VILLAGE HAS FALLEN</h1>
                <p>Too many have died. The darkness has won.</p>
                <button className="restart-button" onClick={resetGame}>TRY AGAIN</button>
            </div>
        </div>
    )
}
