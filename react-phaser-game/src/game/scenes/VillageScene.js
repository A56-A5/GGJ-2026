import Phaser from 'phaser'
import { AssetLoader } from '../utils/AssetLoader'
import { PlayerController } from '../utils/PlayerController'
import { HouseManager } from '../utils/HouseManager'
import { InteractionManager } from '../utils/InteractionManager'

/**
 * Main game scene for the village
 * 
 * Now modularized into smaller components:
 * - AssetLoader: Handles asset loading
 * - PlayerController: Handles player movement
 * - HouseManager: Handles house creation and management
 * - InteractionManager: Handles proximity detection and interactions
 */
export class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' })
    this.assetLoader = null
    this.playerController = null
    this.houseManager = null
    this.interactionManager = null
  }

  preload() {
    // Initialize asset loader
    this.assetLoader = new AssetLoader(this)
    this.assetLoader.preload()
  }

  create() {
    // Create placeholder images for missing assets
    this.assetLoader.createPlaceholders()

    // Create village background
    const bg = this.add.image(0, 0, 'village-bg')
    bg.setOrigin(0, 0)

    // Set world bounds (village boundaries)
    this.physics.world.setBounds(0, 0, 1600, 1200)

    // Initialize player controller
    this.playerController = new PlayerController(this)
    const player = this.playerController.create()

    // Set up camera to follow player
    this.cameras.main.setBounds(0, 0, 1600, 1200)
    this.cameras.main.startFollow(player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1)

    // Initialize house manager
    this.houseManager = new HouseManager(this, player)
    const houseData = this.houseManager.create()

    // Initialize interaction manager
    this.interactionManager = new InteractionManager(this, houseData, this.playerController)
    this.interactionManager.create()
  }

  update() {
    try {
      // Update player movement
      if (this.playerController) {
        this.playerController.update()
      }

      // Update interactions (proximity detection, E key, etc.)
      if (this.interactionManager) {
        this.interactionManager.update()
      }
    } catch (error) {
      console.error('Error in VillageScene.update:', error)
    }
  }
}
