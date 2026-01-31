import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'

/**
 * Interaction Manager (Cursor Version)
 * Handles house selection via WASD and interaction
 */
export class InteractionManager {
  constructor(scene, houseData, houseManager) {
    this.scene = scene
    this.houseData = houseData // Array of house objects { id, x, y, sprite }
    this.houseManager = houseManager
    this.selectedIndex = 0
    this.cursorIcon = null
    this.keys = null
    this.isMoving = false
  }

  create() {
    // Create cursor visual (Arrow pointing down)
    this.cursorIcon = this.scene.add.text(0, 0, '▼', {
      fontSize: '40px',
      fill: '#ffff00',
      fontStyle: 'bold'
    })
    this.cursorIcon.setDepth(10000)
    this.cursorIcon.setOrigin(0.5, 1)

    // Setup input keys
    if (this.scene.input.keyboard) {
      this.keys = this.scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        interact: Phaser.Input.Keyboard.KeyCodes.E,
        interact2: Phaser.Input.Keyboard.KeyCodes.SPACE,
        arrowUp: Phaser.Input.Keyboard.KeyCodes.UP,
        arrowDown: Phaser.Input.Keyboard.KeyCodes.DOWN,
        arrowLeft: Phaser.Input.Keyboard.KeyCodes.LEFT,
        arrowRight: Phaser.Input.Keyboard.KeyCodes.RIGHT
      })
    }

    // Select initial house
    this.selectHouse(0)

    // Enable mouse selection
    this.scene.input.on('pointerdown', this.handleMouseClick, this)

    // Add hover support
    this.houseData.forEach((house, index) => {
      house.sprite.on('pointerover', () => {
        if (!useGameStore.getState().isPaused) {
          this.selectHouse(index)
        }
      })
    })
  }

  update() {
    const state = useGameStore.getState()
    if (state.isPaused) return

    // Handle Input
    if (Phaser.Input.Keyboard.JustDown(this.keys.right) || Phaser.Input.Keyboard.JustDown(this.keys.arrowRight)) {
      this.moveSelection(1, 0)
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.left) || Phaser.Input.Keyboard.JustDown(this.keys.arrowLeft)) {
      this.moveSelection(-1, 0)
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.up) || Phaser.Input.Keyboard.JustDown(this.keys.arrowUp)) {
      this.moveSelection(0, -1)
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.down) || Phaser.Input.Keyboard.JustDown(this.keys.arrowDown)) {
      this.moveSelection(0, 1)
    }

    // Handle Interaction
    if (Phaser.Input.Keyboard.JustDown(this.keys.interact) || Phaser.Input.Keyboard.JustDown(this.keys.interact2)) {
      const selectedHouse = this.houseData[this.selectedIndex]
      if (selectedHouse) {
        useGameStore.getState().openHouseEvent(selectedHouse.id)
      }
    }

    // Update cursor position (smooth follow)
    const targetHouse = this.houseData[this.selectedIndex]
    if (targetHouse && this.cursorIcon) {
      // Offset above the house
      const halfHeight = (targetHouse.sprite.height * targetHouse.sprite.scaleY) / 2
      const targetY = targetHouse.y - halfHeight - 20

      // Snap or lerp cursor
      this.cursorIcon.setPosition(targetHouse.x, targetY)

      // Bobbing animation
      this.cursorIcon.y += Math.sin(this.scene.time.now / 200) * 2

      // Enforce Highlight (Fix for lost tint)
      // We do this every frame to ensure HouseManager updates don't wipe the selection tint
      if (targetHouse.sprite.tintTopLeft !== 0xffff00) {
        targetHouse.sprite.setTint(0xffff00)
      }
    }
  }

  // Find the next house in the direction vector (dx, dy)
  moveSelection(dx, dy) {
    const current = this.houseData[this.selectedIndex]
    let bestCandidate = -1
    let bestScore = Infinity // Lower is better

    this.houseData.forEach((house, index) => {
      if (index === this.selectedIndex) return

      // Vector to house
      const vx = house.x - current.x
      const vy = house.y - current.y

      // Check dot product to see if it's generally in the right direction
      // Direction vector is (dx, dy)
      const dot = (vx * dx) + (vy * dy)

      if (dot > 0) {
        // It's in the direction (roughly)
        const distSq = vx * vx + vy * vy

        // Score favors closer distance but heavily penalizes angular deviation
        // Simple projection: we emphasize the component along the direction axis
        // We can use: Distance / DotProduct (This favors direct alignment)
        // Score = distSq / (dot * dot) works well for "cone" search

        const score = distSq / (dot * dot)

        if (score < bestScore) {
          bestScore = score
          bestCandidate = index
        }
      }
    })

    if (bestCandidate !== -1) {
      this.selectHouse(bestCandidate)
    }
  }

  selectHouse(index) {
    // Restore visual of previous house
    const previousHouse = this.houseData[this.selectedIndex]
    if (previousHouse) {
      if (this.houseManager) {
        this.houseManager.restoreVisual(previousHouse)
      } else {
        // Fallback if no manager passed
        previousHouse.sprite.clearTint()
      }
    }

    this.selectedIndex = index
    const house = this.houseData[index]

    if (house) {
      house.sprite.setTint(0xffff00) // Highlight Yellow

      // Pan Camera
      this.scene.cameras.main.pan(house.x, house.y, 500, 'Power2')
    }
  }

  handleMouseClick(pointer) {
    if (useGameStore.getState().isPaused) return

    // World coords
    const worldX = this.scene.cameras.main.scrollX + pointer.x
    const worldY = this.scene.cameras.main.scrollY + pointer.y

    // Check clicks
    let clickedIndex = -1
    let minDist = 100 // Hitbox radius

    this.houseData.forEach((house, index) => {
      const dist = Phaser.Math.Distance.Between(worldX, worldY, house.x, house.y)
      if (dist < minDist) {
        minDist = dist
        clickedIndex = index
      }
    })

    if (clickedIndex !== -1) {
      this.selectHouse(clickedIndex)
      useGameStore.getState().openHouseEvent(this.houseData[clickedIndex].id)
    }
  }
}
