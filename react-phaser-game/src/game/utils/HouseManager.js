import { houses } from '../../data/houses'

/**
 * House Manager
 * Handles house creation, collision, and data management
 */
export class HouseManager {
  constructor(scene, player) {
    this.scene = scene
    this.player = player
    this.houseSprites = []
    this.houseData = []
  }

  create() {
    // Create houses from data structure
    houses.forEach((houseConfig) => {
      // Create house sprite group for physics
      const houseGroup = this.scene.physics.add.staticGroup()
      const houseSprite = houseGroup.create(houseConfig.x, houseConfig.y, houseConfig.image)
      houseSprite.setOrigin(0.5, 0.5)
      houseSprite.setScale(1)

      // Store complete house data including NPC info
      const houseData = {
        id: houseConfig.id,
        x: houseConfig.x,
        y: houseConfig.y,
        npc: houseConfig.npc,
        sprite: houseSprite
      }

      this.houseSprites.push(houseGroup)
      this.houseData.push(houseData)

      // Add collision between player and house
      this.scene.physics.add.collider(this.player, houseGroup)

      // Make house interactive (clickable)
      houseSprite.setInteractive({ useHandCursor: true })
      houseSprite.on('pointerover', () => {
        // Only highlight if not already the closest house
        // This will be managed by InteractionManager
        if (!houseSprite.tintTopLeft) {
          houseSprite.setTint(0xffff00) // Yellow highlight on hover
        }
      })
      houseSprite.on('pointerout', () => {
        // Only clear tint if not the closest house
        if (!houseSprite.tintTopLeft || houseSprite.tintTopLeft === 0xffff00) {
          houseSprite.clearTint()
        }
      })
    })

    return this.houseData
  }

  getAllHouses() {
    return this.houseData
  }
}
