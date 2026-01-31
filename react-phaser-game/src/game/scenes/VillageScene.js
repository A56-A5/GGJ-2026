import Phaser from 'phaser'
import { AssetLoader } from '../utils/AssetLoader'
import { PlayerController } from '../utils/PlayerController'
import { HouseManager } from '../utils/HouseManager'
import { InteractionManager } from '../utils/InteractionManager'
import { useGameStore } from '../../store/gameStore'

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
    this.storeUnsubscribe = null // For cleanup
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
    const player = this.playerController.create(800, 600) // Default spawn

    // Set up camera to follow player
    this.cameras.main.setBounds(0, 0, 1600, 1200)
    this.cameras.main.startFollow(player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1)

    // Initialize house manager
    // IMPORTANT: Sync with store houses (which contains status updates)
    // We might need to listen to store updates to visually update houses (e.g. infection)
    const { houses } = useGameStore.getState()
    this.houseManager = new HouseManager(this, player, houses)
    const houseData = this.houseManager.create()

    // Initialize interaction manager
    this.interactionManager = new InteractionManager(this, houseData, this.playerController)
    this.interactionManager.create()

    // Listen for store changes to update house visuals (e.g. infected status)
    this.storeUnsubscribe = useGameStore.subscribe((state) => {
      // Ideally we would update house sprites here
      // For now, simpler implementation: scene restart or simple update loop?
      // Let's stick to update loop handling visual updates if needed
      // Or simpler: The store updates -> React updates UI. 
      // House sprites in Phaser are static unless we animate them.
      // Requirement: "One of the houses will be showing the indicator of yellow or exclamation mark"
      // We can handle this in InteractionManager or HouseManager update
    })
  }

  update() {
    // Freeze gameplay when an overlay is open
    if (useGameStore.getState().isPaused) {
      this.playerController?.stop()
      return
    }

    // Update player movement
    if (this.playerController) {
      this.playerController.update()
    }

    // Update interactions (proximity detection, E key, etc.)
    if (this.interactionManager) {
      this.interactionManager.update()
    }
  }

  shutdown() {
    // Clean up store subscription
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe()
      this.storeUnsubscribe = null
    }
  }
}
