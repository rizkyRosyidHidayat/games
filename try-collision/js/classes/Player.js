class Player {
  constructor({ position, collisionBlocks }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.collisionBlocks = collisionBlocks;
    this.jumping = false;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0)";
    c.fillRect(this.position.x, this.position.y, 50, 50);
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        checkCollisionBlockInteract({
          player: {
            position: this.position,
            height: 50,
            width: 50,
          },
          collisionBlock: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.jumping = false;
          this.position.y = collisionBlock.position.y - 50 - 0.01;
          break;
        }
      }
    }
  }
  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        checkCollisionBlockInteract({
          player: {
            position: this.position,
            height: 50,
            width: 50,
          },
          collisionBlock: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.position.x = collisionBlock.position.x - 50 - 0.01;
          break;
        }
      }
    }
  }

  update() {
    this.applyGravity();
    this.checkForVerticalCollisions();
    this.draw();

    this.position.x += this.velocity.x;
    this.checkForHorizontalCollisions();
  }
}
