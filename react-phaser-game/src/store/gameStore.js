import { create } from 'zustand'

/**
 * Zustand store for communication between Phaser and React
 * This keeps Phaser isolated from React re-renders
 * 
 * Now handles NPC dialog data for conversation system
 */
export const useGameStore = create((set) => ({
  // Game state
  isPaused: false,
  currentHouse: null, // { id, x, y, npc: { name, portrait, dialog } }
  currentDialogIndex: 0, // Index of current dialog in dialog array
  
  // Actions
  openHouseMenu: (house) => {
    set({ 
      currentHouse: house,
      currentDialogIndex: 0, // Start at first dialog
      isPaused: true 
    })
  },
  
  closeHouseMenu: () => {
    set({ 
      currentHouse: null,
      currentDialogIndex: 0,
      isPaused: false 
    })
  },
  
  setDialogIndex: (index) => {
    set({ currentDialogIndex: index })
  },
  
  setPaused: (paused) => {
    set({ isPaused: paused })
  },
}))
