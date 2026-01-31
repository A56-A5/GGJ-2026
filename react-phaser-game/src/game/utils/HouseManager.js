/**
 * House Manager
 * Handles house creation, collision, and data management
 */
import { useGameStore } from '../../store/gameStore'

export class HouseManager {
  constructor(scene, player, houses) {
    this.scene = scene
    this.player = player
    this.houses = houses
    this.houseSprites = []
    this.houseData = []
    this.housesById = new Map()
    // Indicators mapping: houseId -> indicatorSprite
    this.indicators = new Map()
  }

  create() {
    // Create houses from data structure
    this.houses.forEach((houseConfig) => {
      // Create house sprite group for physics
      const houseGroup = this.scene.physics.add.staticGroup()
      // Use correct property names from houses.js (x, y, image)
      const houseSprite = houseGroup.create(
        houseConfig.x,
        houseConfig.y,
        houseConfig.image
      )
      houseSprite.setOrigin(0.5, 0.5)
      houseSprite.setScale(1)

      // Store complete house data
      const houseData = {
        id: houseConfig.id,
        type: houseConfig.type,
        x: houseConfig.x,
        y: houseConfig.y,
        status: houseConfig.status,
        sprite: houseSprite,
        width: houseSprite.width, // Store dimensions for UI
        height: houseSprite.height
      }

      this.houseSprites.push(houseGroup)
      this.houseData.push(houseData)
      this.housesById.set(houseData.id, houseData)

      // Add collision between player and house
      this.scene.physics.add.collider(this.player, houseGroup)

      // Make house interactive (clickable)
      houseSprite.setInteractive({ useHandCursor: true })

      // Initial visual check
      this.updateHouseVisual(houseData)
    })

    // Subscribe to store updates to handle status changes (infection)
    useGameStore.subscribe((state) => {
      this.updateAllVisuals(state.houses)
    })

    return this.houseData
  }

  updateAllVisuals(housesState) {
    housesState.forEach(updatedHouse => {
      const existingHouseData = this.housesById.get(updatedHouse.id)
      if (existingHouseData) {
        // Update local status
        existingHouseData.status = updatedHouse.status
        this.updateHouseVisual(existingHouseData)
      }
    })
  }

  updateHouseVisual(houseData) {
    // Manage warning indicator for infected houses
    if (houseData.status === 'infected') {
      if (!this.indicators.has(houseData.id)) {
        // Create a warning mark above the house
        const indicator = this.scene.add.text(houseData.x, houseData.y - 100, '!', {
          fontSize: '64px',
          fill: '#ff0000',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 6
        }).setOrigin(0.5)

        // Add a simple tween to make it bob
        this.scene.tweens.add({
          targets: indicator,
          y: houseData.y - 120,
          duration: 1000,
          yoyo: true,
          repeat: -1
        })

        this.indicators.set(houseData.id, indicator)
        houseData.sprite.setTint(0x888888) // Darken the house sprite
      }
    } else {
      // Remove indicator if it exists (e.g. if cured, though not in plan yet)
      if (this.indicators.has(houseData.id)) {
        this.indicators.get(houseData.id).destroy()
        this.indicators.delete(houseData.id)
        houseData.sprite.clearTint()
      }
    }
  }

  getAllHouses() {
    return this.houseData
  }

  getHouseById(id) {
    return this.housesById.get(id) || null
  }
}
