import React, { useState } from 'react'
import './IntroScreen.css'

export function IntroScreen() {
    const [visible, setVisible] = useState(true)

    if (!visible) return null

    return (
        <div className="intro-overlay">
            <div className="intro-content">
                <h1>THE SKINWALKER</h1>
                <div className="intro-text">
                    <p>In the isolated village of Oakhaven, not everyone is who they seem.</p>
                    <p>A Skinwalker hides among the villagers, wearing the faces of those you trust.</p>
                    <p>Talk to your neighbors. Ask the right questions. Find the inconsistencies.</p>
                    <p className="warning">Every night, it claims another face.</p>
                    <p>Survive until only two remain.</p>
                </div>
                <button className="intro-button" onClick={() => setVisible(false)}>
                    BEGIN NIGHTMARE
                </button>
            </div>
        </div>
    )
}
