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
      const { sessionId } = get()
      if (!sessionId) {
        const data = await gameApi.createSession()
        if (data && data.session_id) {
          set({ sessionId: data.session_id })
          console.log("Game Session Started:", data.session_id)
        }
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
    skinwalkerId: null,
    hasWon: false,
    eliminationMode: false,

    // Initialize Skinwalker (should be called on app mount or store init if possible, or lazy load)
    // We can do it in the create function logic if we move it out, but simpler to check in actions.
    // Let's just pick one when the store is created? 
    // Zustand create doesn't easily run init code inside.
    // We'll lazy init or just pick ID now? 
    // Let's rely on a helper or pick it in 'eliminate' if empty?
    // Better: Pick it right here in initial state helper (outside logic).

    setEliminationMode: (isActive) => set({ eliminationMode: isActive }),

    eliminateVillager: (targetId) => {
      const { skinwalkerId, houses } = get()
      // If no skinwalker set, pick random living villager (except current target maybe? no, define truth first)
      let currentSkinwalkerId = skinwalkerId
      if (!currentSkinwalkerId) {
        // Determine skinwalker now if not set
        const potential = initialHouses.filter(h => h.type === 'villager' && h.status !== 'missing')
        if (potential.length > 0) {
          const r = Math.floor(Math.random() * potential.length)
          currentSkinwalkerId = potential[r].id
          set({ skinwalkerId: currentSkinwalkerId })
        }
      }

      if (targetId === currentSkinwalkerId) {
        // WIN
        set({ hasWon: true, isPaused: true, currentHouse: null, eliminationMode: false })
      } else {
        // Kill the innocent
        const newHouses = houses.map(h => {
          if (h.id === targetId) {
            return { ...h, status: 'dead', infectedImage: 'assets/murder-house1.png' }
          }
          return h
        })
        set({ houses: newHouses, currentHouse: null, eliminationMode: false, isPaused: false })
      }
    }

  }
})
