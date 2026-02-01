import React from 'react'
import { useGameStore } from '../store/gameStore'
import './WinScreen.css'

export function WinScreen({ message }) {
    const resetGame = () => {
        window.location.reload()
    }

    return (
        <div className="win-screen-overlay">
            <div className="win-content">
                <h1>VICTORY</h1>
                {message ? <p className="win-message">{message}</p> : (
                    <>
                        <p>You have purged the Skinwalker.</p>
                        <p>The village is safe... for now.</p>
                    </>
                )}
                <button className="reset-button" onClick={resetGame}>PLAY AGAIN</button>
            </div>
        </div>
    )
}
