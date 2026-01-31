import { useGameStore } from '../../store/gameStore'

/**
 * QuestIndicatorManager
 *
 * Day 1: highlights the Summoning Circle house with an exclamation mark (!) above it.
 * The indicator disappears after the summoning house has been visited.
 */
export class QuestIndicatorManager {
  constructor(scene, houseManager) {
    this.scene = scene
    this.houseManager = houseManager
    this.indicatorText = null
    this.targetHouseId = 'house_summoning'
  }

  create() {
    // Create the indicator (hidden until we can position it)
    this.indicatorText = this.scene.add.text(0, 0, '!', {
      fontSize: '48px',
      fill: '#ffcc00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    })
    this.indicatorText.setOrigin(0.5, 1)
    this.indicatorText.setDepth(10000)
    this.indicatorText.setVisible(false)

    // Simple bounce animation to draw attention
    this.scene.tweens.add({
      targets: this.indicatorText,
      y: { from: 0, to: -10 },
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  update() {
    if (!this.indicatorText) return

    const { day, summoningVisited } = useGameStore.getState()

    // Only Day 1 objective indicator
    const shouldShow = day === 1 && !summoningVisited
    if (!shouldShow) {
      this.indicatorText.setVisible(false)
      return
    }

    const house = this.houseManager.getHouseById(this.targetHouseId)
    if (!house) {
      this.indicatorText.setVisible(false)
      return
    }

    // Position above the summoning house sprite
    this.indicatorText.setPosition(house.x, house.y - 80)
    this.indicatorText.setVisible(true)
  }
}

