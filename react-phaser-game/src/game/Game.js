import Phaser from 'phaser'
import { VillageScene } from './scenes/VillageScene'

/**
 * Phaser Game instance
 * This is kept separate from React to avoid re-renders
 */
export class Game {
  constructor(containerId) {
    this.config = {
      type: Phaser.AUTO,
      width: 1800,
      height: 1200,
      parent: containerId,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false // Set to true for collision visualization
        }
      },
      scene: [VillageScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    }
    
    this.game = null
  }

  init() {
    if (!this.game) {
      this.game = new Phaser.Game(this.config)
    }
    return this.game
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true)
      this.game = null
    }
  }
}
