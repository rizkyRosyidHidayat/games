class Sprite {
  constructor({
    position,
    imageSrc,
    frameRate = 1,
    scale = 1,
    frameBuffer = 6,
    revert = false,
  }) {
    this.position = position;
    this.loaded = false;
    this.frameRate = frameRate;
    this.scale = scale;
    this.image = new Image();
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true;
    };
    this.image.src = imageSrc;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
    this.revert = revert;
  }

  draw() {
    if (!this.image) return;
    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };
    ctx.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    // this.updateFrames();
  }

  updateFrames() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.revert) {
        if (this.currentFrame - 1 === 0) {
          store.keys.e.pressed = false;
          this.elapsedFrames = 0;
        }
        if (this.currentFrame > 0) this.currentFrame--;
        else this.currentFrame = this.frameRate - 1;
      } else {
        if (this.currentFrame === this.frameRate - 1) {
          store.keys.e.pressed = false;
          this.elapsedFrames = 0;
        }
        if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
        else this.currentFrame = 0;
      }
    }
  }
}
