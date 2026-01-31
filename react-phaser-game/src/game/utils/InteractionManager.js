import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'

/**
 * Interaction Manager
 * Handles house proximity detection, interaction indicators, and menu opening
 */
export class InteractionManager {
  constructor(scene, houseData, player) {
    this.scene = scene
    this.houseData = houseData
    this.player = player
    this.interactionRange = 120 // pixels - increased for easier interaction
    this.closestHouse = null
    this.interactionIcon = null
    this.eKey = null
  }

  create() {
    // Create interaction icon (E) above closest house
    this.interactionIcon = this.scene.add.text(0, 0, 'E', {
      fontSize: '28px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 14, y: 10 },
      fontStyle: 'bold'
    })
    this.interactionIcon.setVisible(false)
    this.interactionIcon.setDepth(10000)
    this.interactionIcon.setOrigin(0.5, 0.5)

    // Set up E key for interaction
    if (this.scene.input.keyboard) {
      this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    }

    // Enable mouse input for clicking houses
    this.scene.input.on('pointerdown', this.handleMouseClick, this)
  }

  update() {
    const state = useGameStore.getState()

    // Don't update if game is paused
    if (state.isPaused) {
      return
    }

    // Safety check - make sure player and houseData are available
    if (!this.player || !this.houseData || !this.interactionIcon) {
      return
    }

    // Check house proximity for highlighting (closest house only)
    this.checkHouseProximity()

    // Interaction only works if the icon is visible
    if (this.eKey && this.closestHouse && this.interactionIcon.visible) {
      if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
        useGameStore.getState().openHouseEvent(this.closestHouse.id)
      }
    }
  }

  checkHouseProximity() {
    // Find the closest house within interaction range
    let closestHouse = null
    let closestDistance = Infinity

    const playerPos = this.player.getPosition()
    if (!playerPos) return

    this.houseData.forEach((houseData) => {
      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        houseData.x,
        houseData.y
      )

      // Track closest house within range
      if (distance < this.interactionRange && distance < closestDistance) {
        closestDistance = distance
        closestHouse = houseData
      }
    })

    // Update closest house and interaction indicator
    const houseChanged = closestHouse !== this.closestHouse
    
    if (houseChanged) {
      // Clear previous highlight
      if (this.closestHouse) {
        this.closestHouse.sprite.clearTint()
      }

      this.closestHouse = closestHouse

      // Highlight closest house and show interaction icon
      if (this.closestHouse) {
        this.closestHouse.sprite.setTint(0x00ff00) // Green highlight for closest
        this.interactionIcon.setVisible(true)
      } else {
        // No house in range - hide interaction indicator
        this.interactionIcon.setVisible(false)
      }
    }

    // Update interaction text position every frame
    // Position in world coordinates (above the house)
    if (this.closestHouse && this.interactionIcon) {
      const worldX = this.closestHouse.x
      const worldY = this.closestHouse.y - 60 // 60 pixels above house

      // Update position in world coordinates
      this.interactionIcon.setPosition(worldX, worldY)
      this.interactionIcon.setVisible(true)
    } else if (!this.closestHouse && this.interactionIcon) {
      // Hide if no closest house
      this.interactionIcon.setVisible(false)
    }
  }

  handleMouseClick = (pointer) => {
    if (useGameStore.getState().isPaused) return

    // Convert screen coordinates to world coordinates
    const worldX = this.scene.cameras.main.scrollX + pointer.x
    const worldY = this.scene.cameras.main.scrollY + pointer.y

    // Check if clicked on closest house
    if (this.closestHouse) {
      const distance = Phaser.Math.Distance.Between(
        worldX,
        worldY,
        this.closestHouse.x,
        this.closestHouse.y
      )

      // If clicked within house bounds (approximate)
      if (distance < 50) {
        // Only interact if the icon is visible (same rule as E)
        if (this.interactionIcon?.visible) {
          useGameStore.getState().openHouseEvent(this.closestHouse.id)
        }
      }
    }
  }
}
