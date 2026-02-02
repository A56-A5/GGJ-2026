const API_BASE = 'https://a1vi.pythonanywhere.com'

export const gameApi = {
    // Create new session
    createSession: async () => {
        try {
            const res = await fetch(`${API_BASE}/api/game/new`, { method: 'POST' })
            return await res.json()
        } catch (err) {
            console.error('API Error:', err)
            return null
        }
    },

    // Interrogate character
    interrogate: async (sessionId, character, message, day) => {
        try {
            const res = await fetch(`${API_BASE}/api/interrogate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, character, message, day })
            })
            return await res.json()
        } catch (err) {
            console.error('API Error:', err)
            return { response: "The wind howls... (Connection Error)" }
        }
    },

    // Advance day (sync with backend)
    advanceDay: async (sessionId) => {
        try {
            const res = await fetch(`${API_BASE}/api/game/${sessionId}/advance-day`, { method: 'POST' })
            return await res.json()
        } catch (err) {
            console.error('API Error:', err)
        }
    },

    // Eliminate suspect
    eliminate: async (sessionId, character) => {
        try {
            const res = await fetch(`${API_BASE}/api/game/${sessionId}/eliminate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ character })
            })
            return await res.json()
        } catch (err) {
            console.error('API Error:', err)
            return { result: "error", message: "Connection failed." }
        }
    }
}
