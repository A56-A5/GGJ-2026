/**
 * House Manager
 * Handles house creation, collision, and data management
 */
export class HouseManager {
  constructor(scene, player, houses) {
    this.scene = scene
    this.player = player
    this.houses = houses
    this.houseSprites = []
    this.houseData = []
    this.housesById = new Map()
  }

  create() {
    // Create houses from data structure (data-driven; any count)
    this.houses.forEach((houseConfig) => {
      // Create house sprite group for physics
      const houseGroup = this.scene.physics.add.staticGroup()
      const houseSprite = houseGroup.create(
        houseConfig.position.x,
        houseConfig.position.y,
        houseConfig.textureKey
      )
      houseSprite.setOrigin(0.5, 0.5)
      houseSprite.setScale(1)

      // Store complete house data (type + events)
      const houseData = {
        id: houseConfig.id,
        type: houseConfig.type,
        x: houseConfig.position.x,
        y: houseConfig.position.y,
        eventsByDay: houseConfig.eventsByDay,
        sprite: houseSprite
      }

      this.houseSprites.push(houseGroup)
      this.houseData.push(houseData)
      this.housesById.set(houseData.id, houseData)

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

  getHouseById(id) {
    return this.housesById.get(id) || null
  }
}
