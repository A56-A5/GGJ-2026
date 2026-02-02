import React, { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import './Sidebar.css'

export default function Sidebar() {
    const { cycle } = useGameStore()
    const [fileEntries, setFileEntries] = useState([])

    // Poll the file-based journal
    useEffect(() => {
        const fetchJournal = async () => {
            try {
                const res = await fetch('https://a1vi.pythonanywhere.com/api/journal')
                const data = await res.json()
                if (data.entries) {
                    setFileEntries(data.entries)
                }
            } catch (e) {
                // Silent fail
            }
        }

        fetchJournal() // Initial
        const interval = setInterval(fetchJournal, 2000) // Poll every 2s
        return () => clearInterval(interval)
    }, [])

    // Hardcoded context for now
    const getContext = (day) => {
        switch (day) {
            case 1: return "Day 1: Kabir is missing. The villagers are scared. Investigate everyone.";
            case 2: return "Day 2: Vikram has been found dead. But he was seen yesterday. Use the Elimination tool only when sure.";
            case 3: return "Day 3: Diya is dead. The Skinwalker is mimicking us perfectly. Trust no one.";
            default: return "Survive.";
        }
    }

    return (
        <div className="sidebar-container">
            <h1 className="sidebar-title">CASE LOG</h1>

            <div className="day-context">
                <div className="day-header">DAY {cycle}</div>
                <p>{getContext(cycle)}</p>
            </div>

            <div className="journal-section">
                <h2 className="journal-header">NOTES</h2>
                <div className="journal-list">
                    {fileEntries.length === 0 && (
                        <p style={{ color: '#555', fontStyle: 'italic' }}>No clues collected yet.</p>
                    )}
                    {fileEntries.map((entry, idx) => (
                        <div key={idx} className="journal-entry">
                            {entry}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
