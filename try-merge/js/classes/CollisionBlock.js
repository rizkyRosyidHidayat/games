class CollisionBlock {
  constructor({ position }) {
    this.position = position;
    this.height = store.collisionSize.height;
    this.width = store.collisionSize.width;
  }

  draw() {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  }

  update() {
    this.draw();
  }
}
