/**
 * Asset Loader Utility
 * Handles loading game assets and creating placeholders
 */
export class AssetLoader {
  constructor(scene) {
    this.scene = scene
    this.failedAssets = new Set()
  }

  preload() {
    // Track which assets failed to load
    this.scene.load.on('loaderror', (file) => {
      this.failedAssets.add(file.key)
    })

    // Attempt to load actual PNG files
    this.scene.load.image('village-bg', '/assets/smth.png')
    this.scene.load.image('house1-infected', '/assets/houses/house1-infected.png')
    this.scene.load.image('house2-infected', '/assets/houses/house2-infected.png')
    this.scene.load.image('house3-infected', '/assets/houses/house3-infected.png')
    this.scene.load.image('house4-infected', '/assets/houses/house4-infected.png')
    this.scene.load.image('house7-infected', '/assets/houses/house7-infected.png')
    this.scene.load.image('house6-infected', '/assets/houses/house6-infected.png')
    this.scene.load.image('house7', '/assets/houses/house7.png') // New house
    this.scene.load.image('house1', '/assets/houses/house1.png') // Keeping for fallback or specific uses
    this.scene.load.image('house2', '/assets/houses/house2.png')
    this.scene.load.image('house3', '/assets/houses/house3.png')
    this.scene.load.image('house4', '/assets/houses/house4.png')
    this.scene.load.image('house5', '/assets/houses/house5.png')
    this.scene.load.image('house6', '/assets/houses/house6.png')
  }

  createPlaceholders() {
    const graphics = this.scene.add.graphics()

    // Village background (Grayscale)
    if (!this.scene.textures.exists('village-bg')) {
      graphics.fillStyle(0x333333, 1)
      graphics.fillRect(0, 0, 1600, 1200)
      graphics.fillStyle(0x1a1a1a, 1)
      for (let i = 0; i < 20; i++) {
        graphics.fillRect(
          Math.random() * 1600,
          Math.random() * 1200,
          100 + Math.random() * 100,
          100 + Math.random() * 100
        )
      }
      graphics.generateTexture('village-bg', 1600, 1200)
      graphics.clear()
    }

    // Player
    if (!this.scene.textures.exists('player')) {
      graphics.fillStyle(0x3498db, 1)
      graphics.fillRect(0, 0, 32, 32)
      graphics.fillStyle(0xffffff, 1)
      graphics.fillRect(8, 10, 4, 4)
      graphics.fillRect(20, 10, 4, 4)
      graphics.generateTexture('player', 32, 32)
      graphics.clear()
    }

    // Houses
    const houseColors = [0x8b4513, 0xa0522d, 0x654321]
    for (let index = 0; index < 3; index++) {
      const houseKey = `house${index + 1}`
      if (!this.scene.textures.exists(houseKey)) {
        const color = houseColors[index]
        graphics.fillStyle(color, 1)
        graphics.fillRect(10, 20, 60, 60)
        graphics.fillStyle(0x5a2d0a, 1)
        graphics.fillTriangle(40, 0, 0, 20, 80, 20)
        graphics.fillStyle(0x3d2817, 1)
        graphics.fillRect(30, 50, 20, 30)
        graphics.fillStyle(0x87ceeb, 1)
        graphics.fillRect(15, 35, 15, 15)
        graphics.fillRect(50, 35, 15, 15)
        graphics.generateTexture(houseKey, 80, 80)
        graphics.clear()
      }
    }

    graphics.destroy()
  }
}
