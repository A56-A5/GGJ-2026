import Phaser from 'phaser'
import { AssetLoader } from '../utils/AssetLoader'
import { PlayerController } from '../utils/PlayerController'
import { HouseManager } from '../utils/HouseManager'
import { InteractionManager } from '../utils/InteractionManager'
import { QuestIndicatorManager } from '../utils/QuestIndicatorManager'
import { RestManager } from '../utils/RestManager'
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
    this.questIndicatorManager = null
    this.restManager = null
  }

  preload() {
    // Initialize asset loader
    this.assetLoader = new AssetLoader(this)
    this.assetLoader.preload()
  }

  create() {
    // Ensure world is initialized (useful if you ever add a "new game" button later)
    // (Does nothing if already initialized by default store state.)

    // Create placeholder images for missing assets
    this.assetLoader.createPlaceholders()

    // Create village background
    const bg = this.add.image(0, 0, 'village-bg')
    bg.setOrigin(0, 0)

    // Set world bounds (village boundaries)
    this.physics.world.setBounds(0, 0, 1600, 1200)

    // Initialize player controller
    this.playerController = new PlayerController(this)
    const { restSpot } = useGameStore.getState()
    const player = this.playerController.create(restSpot?.x ?? 400, restSpot?.y ?? 300)

    // Set up camera to follow player
    this.cameras.main.setBounds(0, 0, 1600, 1200)
    this.cameras.main.startFollow(player, true, 0.1, 0.1)
    this.cameras.main.setZoom(1)

    // Initialize house manager
    const { village } = useGameStore.getState()
    this.houseManager = new HouseManager(this, player, village)
    const houseData = this.houseManager.create()

    // Initialize interaction manager
    this.interactionManager = new InteractionManager(this, houseData, this.playerController)
    this.interactionManager.create()

    // Quest indicator (Day 1: summoning circle)
    this.questIndicatorManager = new QuestIndicatorManager(this, this.houseManager)
    this.questIndicatorManager.create()

    // Rest manager (Day transition trigger)
    this.restManager = new RestManager(this, this.playerController)
    this.restManager.create()
  }

  update() {
    try {
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

      // Update quest indicator
      if (this.questIndicatorManager) {
        this.questIndicatorManager.update()
      }

      // Update rest prompt
      if (this.restManager) {
        this.restManager.update()
      }
    } catch (error) {
      console.error('Error in VillageScene.update:', error)
    }
  }
}
