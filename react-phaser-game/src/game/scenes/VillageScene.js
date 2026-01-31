import Phaser from 'phaser'
import { AssetLoader } from '../utils/AssetLoader'
import { HouseManager } from '../utils/HouseManager'
import { InteractionManager } from '../utils/InteractionManager'
import { useGameStore } from '../../store/gameStore'

/**
 * Main game scene for the village
 */
export class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' })
    this.assetLoader = null
    this.houseManager = null
    this.interactionManager = null
  }

  preload() {
    this.assetLoader = new AssetLoader(this)
    this.assetLoader.preload()
  }

  create() {
    this.assetLoader.createPlaceholders()

    const bg = this.add.image(0, 0, 'village-bg')
    bg.setDisplaySize(1800, 1200)
    bg.setOrigin(0, 0)

    this.physics.world.setBounds(0, 0, 1600, 1200)

    // No player, just camera setup
    this.cameras.main.setBounds(0, 0, 1600, 1200)

    // Initialize house manager
    const { houses } = useGameStore.getState()
    // No player to collide with
    this.houseManager = new HouseManager(this, null, houses)
    const houseData = this.houseManager.create()

    // Initialize interaction manager (Handle Cursor logic)
    // Pass houseManager so we can restore visuals on deselect
    this.interactionManager = new InteractionManager(this, houseData, this.houseManager)
    this.interactionManager.create()
  }

  update() {
    try {
      if (useGameStore.getState().isPaused) return

      if (this.interactionManager) {
        this.interactionManager.update()
      }
    } catch (error) {
      console.error('Error in VillageScene.update:', error)
    }
  }
}
