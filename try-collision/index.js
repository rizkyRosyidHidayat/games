const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Sprites {
  constructor({ position, imageSrc, scale = 1 }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    };
    this.scale = scale;
  }

  draw() {
    if (!this.image) return;
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width * this.scale,
      this.height * this.scale
    );
  }
}

const bgCloud = new Sprites({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/bg-cloud.png',
  scale: 2,
});
const bgCastle = new Sprites({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/bg-castle.png',
  scale: 2,
});
const map = new Sprites({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/map.png',
  scale: 1,
});

const mapLength = 110;
const floorCollisions2D = [];
for (let i = 0; i < floorCollision.length; i += mapLength) {
  floorCollisions2D.push(floorCollision.slice(i, i + mapLength));
}
const collisionBlocks = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 795) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      );
    }
  });
});

const gravity = 0.3;
class Player {
  constructor({ position, collisionBlocks }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.collisionBlocks = collisionBlocks;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0)';
    c.fillRect(this.position.x, this.position.y, 50, 50);
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 50, // 50 = width player
        y: this.position.y + 50, // 50 = height player
      },
      width: 0,
      height: 0,
    };
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision({ object1: this.hitbox, object2: collisionBlock })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - 50;
          break;
        }
      }
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      console.log(
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      );
      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          this.position.x = collisionBlock.position.x - 50;
          break;
        }
      }
    }
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
  }
}

const player = new Player({
  position: {
    x: 0,
    y: 100,
  },
  collisionBlocks: collisionBlocks,
});

const keys = {
  w: {
    presed: false,
  },
  d: {
    presed: false,
  },
  a: {
    presed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  bgCloud.draw();
  bgCastle.draw();
  if (map.height) c.translate(0, canvas.height - map.height);
  map.draw();

  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });

  player.update();
  player.velocity.x = 0;

  if (keys.w.presed) {
    if (player.position.y > 90) player.velocity.y = -6;
  }

  if (keys.d.presed) {
    player.velocity.x = 2;
  } else if (keys.a.presed) {
    player.velocity.x = -2;
  }

  c.restore();
}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.presed = true;
      break;
    case 'd':
      keys.d.presed = true;
      break;
    case 'a':
      keys.a.presed = true;
      break;

    default:
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.presed = false;
      break;
    case 'd':
      keys.d.presed = false;
      break;
    case 'a':
      keys.a.presed = false;
      break;

    default:
      break;
  }
});
