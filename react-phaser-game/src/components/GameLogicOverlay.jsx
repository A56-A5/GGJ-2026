import React from 'react'
import { useGameStore } from '../store/gameStore'
import { FailScreen } from './FailScreen'
import { WinScreen } from './WinScreen'

export function GameLogicOverlay() {
    const { houses, hasWon, eliminationMode, eliminateVillager, setEliminationMode } = useGameStore()

    if (hasWon) {
        return <WinScreen />
    }

    // Count survivors (normal villagers)
    // User said: "fail screen if there is only 2 house left without being infected / dead"
    // So if normal_count <= 2
    const normalCount = houses.filter(h => h.type === 'villager' && h.status === 'normal').length

    if (normalCount <= 2 && !hasWon) {
        return <FailScreen />
    }

    // Elimination UI Overlay
    if (eliminationMode) {
        const survivors = houses.filter(h => h.type === 'villager' && h.status === 'normal')

        return (
            <div className="elimination-overlay">
                <div className="elimination-content">
                    <h2>WHO IS THE SKINWALKER?</h2>
                    <div className="suspect-list">
                        {survivors.map(h => (
                            <button key={h.id} className="suspect-btn" onClick={() => eliminateVillager(h.id)}>
                                {h.npc?.name || 'Unknown Villager'}
                            </button>
                        ))}
                    </div>
                    <button className="cancel-btn" onClick={() => setEliminationMode(false)}>CANCEL</button>
                </div>
            </div>
        )
    }

    return null
}
