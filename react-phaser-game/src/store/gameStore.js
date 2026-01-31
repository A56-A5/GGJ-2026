import { create } from 'zustand'
import { DEFAULT_SEED, generateVillage } from '../data/village'

/**
 * Global game store (React + Phaser bridge).
 *
 * Phaser reads state via `useGameStore.getState()` (no React re-render coupling).
 * React overlays subscribe via the hook.
 */
export const useGameStore = create((set, get) => {
  const initialVillage = generateVillage(DEFAULT_SEED)

  return {
    // --- World / Progress ---
    seed: DEFAULT_SEED,
    day: 1,
    village: initialVillage.houses, // Array of VillageHouse
    restSpot: initialVillage.restSpot,
    chosenNormalForDay2: initialVillage.chosenNormalForDay2,

    // --- Flags ---
    summoningVisited: false,

    // --- Overlay / Event system ---
    isPaused: false, // used by Phaser to freeze movement
    activeEvent: null, // { houseId, type: 'dialog'|'image'|'dayTransition', data }

    // --- Actions ---
    initGame: (seed = DEFAULT_SEED) => {
      const village = generateVillage(seed)
      set({
        seed,
        day: 1,
        village: village.houses,
        restSpot: village.restSpot,
        chosenNormalForDay2: village.chosenNormalForDay2,
        summoningVisited: false,
        isPaused: false,
        activeEvent: null
      })
    },

    /** Returns the current day's event for a given house (or null). */
    getHouseEventForToday: (houseId) => {
      const { village, day } = get()
      const house = village.find((h) => h.id === houseId)
      if (!house) return null
      return house.eventsByDay?.[day] || null
    },

    /** Opens an event overlay for interacting with a house. */
    openHouseEvent: (houseId) => {
      const { village, day, summoningVisited } = get()
      const house = village.find((h) => h.id === houseId)
      if (!house) return false

      const event = house.eventsByDay?.[day]
      if (!event) return false

      // Mark summoning visited (Day 1 objective)
      const nextSummoningVisited =
        summoningVisited || (day === 1 && house.type === 'summoning')

      set({
        summoningVisited: nextSummoningVisited,
        isPaused: true,
        activeEvent: {
          houseId,
          type: event.type,
          data: event.data
        }
      })

      return true
    },

    /** Closes the current overlay and resumes the game. */
    closeActiveEvent: () => {
      set({
        activeEvent: null,
        isPaused: false
      })
    },

    /** Starts a day transition overlay (does not change day until continued). */
    beginDayTransition: (toDay) => {
      set({
        isPaused: true,
        activeEvent: {
          houseId: null,
          type: 'dayTransition',
          data: { toDay }
        }
      })
    },

    /** Completes the day transition and resumes game. */
    completeDayTransition: () => {
      const state = get()
      const toDay = state.activeEvent?.data?.toDay
      if (typeof toDay !== 'number') {
        // Fallback: just close.
        set({ activeEvent: null, isPaused: false })
        return
      }

      set({
        day: toDay,
        activeEvent: null,
        isPaused: false
      })
    }
  }
})
