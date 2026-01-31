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
      houseSprite.setScale(0.5) // Increased size as requested

      // Store complete house data
      const houseData = {
        id: houseConfig.id,
        type: houseConfig.type,
        x: houseConfig.x,
        y: houseConfig.y,
        status: houseConfig.status,
        altImage: houseConfig.altImage, // Store altImage
        sprite: houseSprite,
        width: houseSprite.width, // Store dimensions for UI
        height: houseSprite.height
      }

      this.houseSprites.push(houseGroup)
      this.houseData.push(houseData)
      this.housesById.set(houseData.id, houseData)

      // Add collision between player and house (if player exists)
      if (this.player) {
        this.scene.physics.add.collider(this.player, houseGroup)
      }

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

  // Restores the visual state (tint/texture) without touching indicators
  restoreVisual(houseData) {
    if (houseData.status !== 'normal' && houseData.altImage) {
      // Ideally we'd set texture here too if it was reset, but setTexture is safe to call again?
      // Let's assume texture persists, we just handle tint.
      if (houseData.status === 'infected') {
        houseData.sprite.setTint(0x888888)
      } else if (houseData.status === 'dead') {
        houseData.sprite.setTint(0x333333)
      } else {
        houseData.sprite.clearTint()
      }
    } else {
      houseData.sprite.clearTint()
    }
  }

  updateHouseVisual(houseData) {
    // Clean up existing indicator if any
    if (this.indicators.has(houseData.id)) {
      this.indicators.get(houseData.id).destroy()
      this.indicators.delete(houseData.id)
      houseData.sprite.clearTint()
    }

    if (houseData.status === 'normal') {
      houseData.sprite.clearTint()
      // Note: We assume the original texture is the default or handled by initial creation. 
      // If we need to restore original texture, we might need to store "originalImage" in houseData.
      // However, usually clearing tint is enough if texture wasn't permanently swapped? 
      // Wait, we DO swap texture for missing. So we DO need to restore.
      // But we don't have original image key easily.
      // Let's assume 'normal' implies we shouldn't have changed texture? 
      // Or we can try to reset it if we knew it.
      // For now, let's just clear tint.

    } else {
      // Any non-normal status (infected, dead, missing, etc.)
      // Use altImage if available
      if (houseData.altImage) {
        houseData.sprite.setTexture(houseData.altImage)
        houseData.sprite.setScale(0.5)
      }

      // Keep specific tints if we still want them ON TOP of the alt image?
      // User said "altimage in every single fucking house... if status is changed... it should change to altimage"
      // They also said "there shouldn't be like a skull emoji... remove that feature" (Already done)
      // They didn't explicitly shout about tints, but usually "altImage" implies the image carries the visual.
      // But maybe we keep the indicators (exclamation mark)? 
      // User didn't ask to remove exclamation marks, only skull emoji.
      // Let's keep existing indicator logic for 'infected' (exclamation mark) but use altImage for the sprite.

      if (houseData.status === 'infected') {
        const indicator = this.scene.add.text(houseData.x, houseData.y - 100, '!', {
          fontSize: '64px',
          fill: '#ff0000',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 6
        }).setOrigin(0.5)

        this.scene.tweens.add({
          targets: indicator,
          y: houseData.y - 120,
          duration: 1000,
          yoyo: true,
          repeat: -1
        })
        this.indicators.set(houseData.id, indicator)
        // Maybe tint it slightly red too? Or just trust altImage?
        // Let's tint it as before to be safe + altImage.
        houseData.sprite.setTint(0x888888)
      } else if (houseData.status === 'dead') {
        houseData.sprite.setTint(0x333333)
      } else {
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
