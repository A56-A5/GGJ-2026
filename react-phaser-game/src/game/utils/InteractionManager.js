import Phaser from 'phaser'

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
    this.interactionText = null
    this.eKey = null
    this.gameStore = null
  }

  create() {
    // Create interaction indicator text
    this.interactionText = this.scene.add.text(0, 0, 'Press E', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 16, y: 8 },
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    })
    this.interactionText.setVisible(false)
    this.interactionText.setDepth(10000) // Very high depth to ensure it's on top
    this.interactionText.setOrigin(0.5, 0.5)
    // Keep scrollFactor at 1 (default) so it follows world coordinates

    // Set up E key for interaction
    if (this.scene.input.keyboard) {
      this.eKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.E
      )
      console.log('E key registered:', this.eKey)
    } else {
      console.error('Keyboard not available!')
    }

    // Enable mouse input for clicking houses
    this.scene.input.on('pointerdown', this.handleMouseClick, this)

    // Load game store
    import('../../store/gameStore.js').then((module) => {
      this.gameStore = module.useGameStore.getState()
      console.log('Game store loaded')
    })
  }

  update() {
    // Don't update if game is paused
    if (this.gameStore?.isPaused) {
      return
    }

    // Safety check - make sure player and houseData are available
    if (!this.player || !this.houseData || !this.interactionText) {
      return
    }

    try {
      // Check house proximity for highlighting (closest house only)
      this.checkHouseProximity()

      // Check for E key press to interact with closest house
      if (this.eKey && this.closestHouse) {
        // Use JustDown to detect single key press
        const justPressed = Phaser.Input.Keyboard.JustDown(this.eKey)
        if (justPressed) {
          console.log('E key pressed! Opening house menu for:', this.closestHouse.id)
          this.openHouseMenu(this.closestHouse)
        }
      }
    } catch (error) {
      console.error('Error in InteractionManager.update:', error)
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
        this.interactionText.setVisible(true)
        console.log('Closest house found:', this.closestHouse.id, 'Distance:', closestDistance.toFixed(0))
      } else {
        // No house in range - hide interaction indicator
        this.interactionText.setVisible(false)
      }
    }

    // Update interaction text position every frame
    // Position in world coordinates (above the house)
    if (this.closestHouse && this.interactionText) {
      const worldX = this.closestHouse.x
      const worldY = this.closestHouse.y - 60 // 60 pixels above house

      // Update position in world coordinates
      this.interactionText.setPosition(worldX, worldY)
      this.interactionText.setVisible(true)
    } else if (!this.closestHouse && this.interactionText) {
      // Hide if no closest house
      this.interactionText.setVisible(false)
    }
  }

  handleMouseClick = (pointer) => {
    if (this.gameStore?.isPaused) return

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
        this.openHouseMenu(this.closestHouse)
      }
    }
  }

  openHouseMenu(houseData) {
    // Pass complete house data including NPC info to React
    const housePayload = {
      id: houseData.id,
      x: houseData.x,
      y: houseData.y,
      npc: houseData.npc
    }

    // Ensure store is available
    if (!this.gameStore) {
      import('../../store/gameStore.js').then((module) => {
        this.gameStore = module.useGameStore.getState()
        this.gameStore.openHouseMenu(housePayload)
      })
    } else {
      this.gameStore.openHouseMenu(housePayload)
    }
  }
}
