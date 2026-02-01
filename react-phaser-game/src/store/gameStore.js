import { create } from 'zustand'
import { houses as initialHouses } from '../data/houses'

// Helper to find a random normal villager house
const findRandomNormalHouse = (houses) => {
  const normalHouses = houses.filter(h => h.type === 'villager' && h.status === 'normal')
  if (normalHouses.length === 0) return null
  const randomIndex = Math.floor(Math.random() * normalHouses.length)
  return normalHouses[randomIndex]
}

import { gameApi } from '../services/api'

export const useGameStore = create((set, get) => {
  return {
    houses: JSON.parse(JSON.stringify(initialHouses)),
    cycle: 1,
    isPaused: false,
    currentHouse: null,
    sessionId: null, // Store backend session ID

    // Actions

    // Initialize Game Session (call on App mount)
    initSession: async () => {
      // Always create a new session (Reset)
      const data = await gameApi.createSession()
      if (data && data.session_id) {
        set({ sessionId: data.session_id })
        console.log("Game Session Started:", data.session_id)
      }
    },

    // Open house interaction

    // Open house interaction
    openHouseEvent: (houseId) => {
      const { houses } = get()
      const house = houses.find(h => h.id === houseId)
      if (!house) return

      set({
        currentHouse: house,
        isPaused: true
      })
    },

    // Close interaction
    closeHouseMenu: () => {
      set({
        currentHouse: null,
        isPaused: false
      })
    },

    // Sleep action (triggered from Guard House - Moves to Day 2)
    sleep: async () => {
      const { houses, cycle, sessionId } = get()
      const nextCycle = cycle + 1

      // Sync with backend
      if (sessionId) {
        gameApi.advanceDay(sessionId)
      }

      let newHouses = houses.map(h => {
        const house = { ...h }
        const dayKey = `day${nextCycle}`

        if (house[dayKey]) {
          if (house[dayKey].npc) {
            house.npc = house[dayKey].npc
          }
          if (house[dayKey].status) {
            house.status = house[dayKey].status
          }
          if (house[dayKey].infectedImage) {
            house.infectedImage = house[dayKey].infectedImage
          }
        }
        return house
      })

      // Procedural fallback for days beyond scripted content (Day 4+)
      // If no status changes were applied via script (implied by checking if ANY house changed, or just forcing a death if cycle > 3)
      // The user says "doesn't infect anymore houses".
      if (nextCycle > 3) {
        const normalHouses = newHouses.filter(h => h.status === 'normal' && h.type === 'villager')
        if (normalHouses.length > 0) {
          const victimIndex = Math.floor(Math.random() * normalHouses.length)
          const victim = normalHouses[victimIndex]
          victim.status = 'dead'
          victim.infectedImage = 'assets/murder-house1.png'
        }
      }

      set({
        houses: newHouses,
        cycle: nextCycle,
        currentHouse: null,
        isPaused: false
      })
    },

    // --- ELIMINATION LOGIC ---
    skinwalkerId: null, // Deprecated, handled by backend
    hasWon: false,
    hasLost: false, // New explicit loss state
    eliminationMode: false,
    endGameMessage: "", // Store the result message

    setEliminationMode: (isActive) => set({ eliminationMode: isActive }),

    eliminateVillager: async (targetId) => {
      const { houses, sessionId } = get()
      const targetHouse = houses.find(h => h.id === targetId)

      if (!targetHouse || !targetHouse.npc) {
        console.error("Target invalid")
        return
      }

      const characterName = targetHouse.npc.name
      console.log("Eliminating:", characterName)

      // Call Backend
      if (sessionId) {
        const result = await gameApi.eliminate(sessionId, characterName)

        if (result && result.result === 'win') {
          set({
            hasWon: true,
            eliminationMode: false,
            isPaused: true,
            endGameMessage: result.message
          })
        } else {
          // LOSE or ERROR (Treat error as loss for high stakes? Or just alert?)
          // User said "if you are wrong you lose"
          set({
            hasLost: true,
            eliminationMode: false,
            isPaused: true,
            endGameMessage: result.message || "You killed an innocent. The Skinwalker remains."
          })
        }
      } else {
        // Fallback for dev without backend
        console.warn("No session ID, falling back to local logic (deprecated)")
        // ... (Old logic omitted for safety, just error)
      }
    },

    // --- JOURNAL LOGIC ---
    journalEntries: [],

    addJournalEntry: (text) => {
      const { journalEntries, cycle } = get()
      const newEntry = {
        id: Date.now(),
        day: cycle,
        text,
        time: new Date().toLocaleTimeString()
      }
      set({ journalEntries: [newEntry, ...journalEntries] })
    }

  }
})
