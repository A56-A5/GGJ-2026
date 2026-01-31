import Phaser from 'phaser'
import { useGameStore } from '../../store/gameStore'

/**
 * RestManager
 *
 * Day 1 -> Day 2 transition:
 * - After visiting the summoning circle (summoningVisited = true),
 *   the player can rest at the rest spot (near spawn).
 * - Shows an "R" icon when in range. Pressing R triggers a Day Transition overlay.
 */
export class RestManager {
  constructor(scene, playerController) {
    this.scene = scene
    this.playerController = playerController
    this.rKey = null
    this.restIcon = null
  }

  create() {
    this.restIcon = this.scene.add.text(0, 0, 'R', {
      fontSize: '28px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 14, y: 10 },
      fontStyle: 'bold'
    })
    this.restIcon.setVisible(false)
    this.restIcon.setDepth(10000)
    this.restIcon.setOrigin(0.5, 0.5)

    if (this.scene.input.keyboard) {
      this.rKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    }
  }

  update() {
    const state = useGameStore.getState()

    if (state.isPaused) {
      this.restIcon?.setVisible(false)
      return
    }

    // Only Day 1 -> Day 2 transition for now
    if (state.day !== 1 || !state.summoningVisited) {
      this.restIcon?.setVisible(false)
      return
    }

    const pos = this.playerController.getPosition()
    if (!pos) {
      this.restIcon?.setVisible(false)
      return
    }

    const rest = state.restSpot
    if (!rest) {
      this.restIcon?.setVisible(false)
      return
    }

    const dist = Phaser.Math.Distance.Between(pos.x, pos.y, rest.x, rest.y)
    const inRange = dist <= rest.radius

    if (!inRange) {
      this.restIcon.setVisible(false)
      return
    }

    // Show icon above rest spot
    this.restIcon.setPosition(rest.x, rest.y - 60)
    this.restIcon.setVisible(true)

    // Press R to rest -> start day transition overlay
    if (this.rKey && Phaser.Input.Keyboard.JustDown(this.rKey)) {
      useGameStore.getState().beginDayTransition(2)
    }
  }
}

