/**
 * Player Controller
 * Handles player movement and input
 */
export class PlayerController {
  constructor(scene) {
    this.scene = scene
    this.player = null
    this.cursors = null
    this.wasdKeys = null
    this.speed = 200
  }

  create(spawnX = 400, spawnY = 300) {
    // Create player sprite
    this.player = this.scene.physics.add.sprite(spawnX, spawnY, 'player')
    this.player.setCollideWorldBounds(true)
    this.player.setScale(1)

    // Ensure keyboard is enabled
    if (!this.scene.input.keyboard) {
      // Keyboard input is not available - player will not be controllable
      return this.player
    }

    // Set up input
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.wasdKeys = this.scene.input.keyboard.addKeys('W,S,A,D')
    
    return this.player
  }

  update() {
    if (!this.player) {
      return
    }

    if (!this.cursors || !this.wasdKeys) {
      // Try to reinitialize if missing
      if (this.scene.input.keyboard) {
        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this.wasdKeys = this.scene.input.keyboard.addKeys('W,S,A,D')
      }
      return
    }

    let velocityX = 0
    let velocityY = 0

    // Check arrow keys or WASD
    if ((this.cursors.left && this.cursors.left.isDown) || (this.wasdKeys.A && this.wasdKeys.A.isDown)) {
      velocityX = -this.speed
    } else if ((this.cursors.right && this.cursors.right.isDown) || (this.wasdKeys.D && this.wasdKeys.D.isDown)) {
      velocityX = this.speed
    }

    if ((this.cursors.up && this.cursors.up.isDown) || (this.wasdKeys.W && this.wasdKeys.W.isDown)) {
      velocityY = -this.speed
    } else if ((this.cursors.down && this.cursors.down.isDown) || (this.wasdKeys.S && this.wasdKeys.S.isDown)) {
      velocityY = this.speed
    }

    // Set velocity
    this.player.setVelocity(velocityX, velocityY)
  }

  getPosition() {
    return this.player ? { x: this.player.x, y: this.player.y } : null
  }

  stop() {
    if (this.player) {
      this.player.setVelocity(0, 0)
    }
  }
}
