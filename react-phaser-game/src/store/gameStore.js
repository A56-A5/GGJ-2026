import { create } from 'zustand'
import { houses as initialHouses } from '../data/houses'

// Helper to deep copy objects
const deepCopy = (obj) => {
  // Use structuredClone if available (modern browsers), otherwise fallback to JSON
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(obj)
  }
  return JSON.parse(JSON.stringify(obj))
}

// Helper to find a random normal villager house
const findRandomNormalHouse = (houses) => {
  const normalHouses = houses.filter(h => h.type === 'villager' && h.status === 'normal')
  if (normalHouses.length === 0) return null
  const randomIndex = Math.floor(Math.random() * normalHouses.length)
  return normalHouses[randomIndex]
}

export const useGameStore = create((set, get) => {
  return {
    houses: deepCopy(initialHouses), // Deep copy to allow mutation
    cycle: 1, // Day cycle
    isPaused: false,
    currentHouse: null, // The house currently being interacted with

    // Actions

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
    sleep: () => {
      const { houses, cycle } = get()
      const nextCycle = cycle + 1

      let newHouses = houses.map(h => {
        // Deep copy house
        const house = { ...h }

        // If transitioning to Day 2, swap data
        if (nextCycle === 2) {
          if (house.day2) {
            if (house.day2.npc) {
              house.npc = house.day2.npc
            }
            if (house.day2.status) {
              house.status = house.day2.status
            }
            if (house.day2.infectedImage) {
              house.infectedImage = house.day2.infectedImage
            }
          }
        }
        return house
      })

      set({
        houses: newHouses,
        cycle: nextCycle,
        currentHouse: null,
        isPaused: false
      })
    }
  }
})
