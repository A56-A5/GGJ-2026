import React from 'react'
import { useGameStore } from '../store/gameStore'
import { FailScreen } from './FailScreen'
import { WinScreen } from './WinScreen'

export function GameLogicOverlay() {
    const { houses, hasWon, hasLost, eliminationMode, eliminateVillager, setEliminationMode, endGameMessage, cycle } = useGameStore()

    if (hasWon) {
        return <WinScreen message={endGameMessage} />
    }

    if (hasLost) {
        return <FailScreen message={endGameMessage} />
    }

    // Count survivors (normal villagers)
    const normalCount = houses.filter(h => h.type === 'villager' && h.status === 'normal').length

    // Fail if only 1 or 0 survivors remain (Day 4 allows 2 survivors - final showdown)
    // OR if we're past Day 4 and still have 2+ survivors (shouldn't happen but safety check)
    if ((normalCount <= 1 && !hasWon) || (cycle > 4 && normalCount >= 2)) {
        return <FailScreen message="The Rakshasa has won. The village is lost." />
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
                            <button key={h.id} className="suspect-btn" onClick={() => {
                                console.log("Clicked suspect:", h.id)
                                eliminateVillager(h.id)
                            }}>
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
