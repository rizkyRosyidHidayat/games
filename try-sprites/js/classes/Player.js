class Player extends Sprite {
  constructor({ position, imageSrc, frameRate, animations }) {
    super({ imageSrc, frameRate });
    this.position = position;
    this.frameRate = frameRate;
    this.animations = animations;
    this.lastDirection = 'right';
    this.jumpHeight = 0;
    this.currentFrame = this.currentFrame;

    for (const key in this.animations) {
      if (Object.hasOwnProperty.call(this.animations, key)) {
        const element = this.animations[key];
        const image = new Image();
        image.src = element.imageSrc;
        element.image = image;
      }
    }
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

  update() {
    this.draw();
    this.updateFrames();
  }
}
