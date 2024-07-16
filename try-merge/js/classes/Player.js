class Player extends Sprite {
  constructor({
    position,
    imageSrc,
    frameRate,
    animations,
    collisionBlocks,
    scale,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.frameRate = frameRate;
    this.animations = animations;
    this.lastDirection = "right";
    this.currentFrame = this.currentFrame;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.collisionBlocks = collisionBlocks;
    this.jump = false;
    this.fall = false;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      height: 10,
      width: 10,
    };

    for (const key in this.animations) {
      if (Object.hasOwnProperty.call(this.animations, key)) {
        const element = this.animations[key];
        const image = new Image();
        image.src = element.imageSrc;
        element.image = image;
      }
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  switchSprite(key) {
    const animations = this.animations[key];
    if (this.image === animations.image || !this.loaded) return;
    this.currentFrame = 0;
    this.image = animations.image;
    this.frameBuffer = animations.frameBuffer;
    this.frameRate = animations.frameRate;
    this.revert = animations?.revert ?? false;
  }

  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >=
        store.mapImageSize.width ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  updateHitBox() {
    this.hitbox = {
      position: {
        x: this.position.x + 55 * this.scale,
        y: this.position.y + 48 * this.scale,
      },
      height: 38 * this.scale,
      width: 26 * this.scale,
    };
  }

  updateCamerabox() {
    const width = 400;
    const height = 200;
    this.camerabox = {
      position: {
        x: this.position.x - (width / 2 - store.playerSize.width / 2),
        y: this.position.y - (height / 2 - store.playerSize.height / 2),
      },
      width,
      height,
    };
  }

  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const scaledDownCanvasWidth = canvas.width;

    if (cameraboxRightSide >= store.mapImageSize.width) return;

    if (
      cameraboxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight({ canvas, camera }) {
    if (this.camerabox.position.x <= 0) return;

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraDown({ canvas, camera }) {
    if (this.camerabox.position.y + this.velocity.y <= 0) return;

    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraUp({ canvas, camera }) {
    if (
      this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
      store.bgImageSize.height
    )
      return;

    const scaledCanvasHeight = canvas.height;

    if (
      this.camerabox.position.y + this.camerabox.height >=
      Math.abs(camera.position.y) + scaledCanvasHeight
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitBox();
    this.updateCamerabox();
    // ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    // ctx.fillRect(
    //   this.camerabox.position.x,
    //   this.camerabox.position.y,
    //   this.camerabox.width,
    //   this.camerabox.height
    // );
    // draws out the image
    // ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    // ctx.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );
    this.draw();

    this.position.x += this.velocity.x;
    this.updateHitBox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitBox();
    this.checkForVerticalCollisions();
  }

  applyGravity() {
    this.velocity.y += store.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (
        checkCollisionBlockInteract({
          player: this.hitbox,
          collisionBlock: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.jump = false;
          this.fall = false;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
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
          player: this.hitbox,
          collisionBlock: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
      }
    }
  }
}
