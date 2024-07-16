const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = store.bgImageSize.width;
canvas.height = store.bgImageSize.height;

const bgCloud = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/img/bg-cloud.png",
  scale: (canvas.width * 1) / store.bgImageSize.width,
});
const bgCastle = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/img/bg-castle.png",
  scale: (canvas.width * 1) / store.bgImageSize.width,
});
const map = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/img/map.png",
});

const floorCollision = [];
for (let i = 0; i < collision.floor.length; i += store.mapLengthTile) {
  floorCollision.push(collision.floor.slice(i, i + store.mapLengthTile));
}

const collisionBlocks = [];
floorCollision.forEach((row, y) => {
  row.forEach((code, x) => {
    if (code === store.collisionCode) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * store.collisionSize.width,
            y: y * store.collisionSize.height,
          },
        })
      );
    }
  });
});

const player = new Player({
  position: {
    x: 0,
    y: 100,
  },
  scale: 1,
  imageSrc: "./assets/img/player/right/Idle.png",
  frameRate: 10,
  collisionBlocks,
  scale: 1.5,
  animations: {
    Idle: {
      imageSrc: "./assets/img/player/right/Idle.png",
      frameBuffer: 4,
      frameRate: 10,
    },
    IdleLeft: {
      imageSrc: "./assets/img/player/left/Idle.png",
      frameBuffer: 4,
      frameRate: 10,
      revert: true,
    },
    Run: {
      imageSrc: "./assets/img/player/right/Run.png",
      frameBuffer: 4,
      frameRate: 6,
    },
    RunLeft: {
      imageSrc: "./assets/img/player/left/Run.png",
      frameBuffer: 4,
      frameRate: 6,
      revert: true,
    },
    Jump: {
      imageSrc: "./assets/img/player/right/Jump.png",
      frameBuffer: 4,
      frameRate: 2,
    },
    Fall: {
      imageSrc: "./assets/img/player/right/Fall.png",
      frameBuffer: 4,
      frameRate: 2,
    },
    JumpLeft: {
      imageSrc: "./assets/img/player/left/Jump.png",
      frameBuffer: 4,
      frameRate: 2,
      revert: true,
    },
    FallLeft: {
      imageSrc: "./assets/img/player/left/Fall.png",
      frameBuffer: 4,
      frameRate: 2,
      revert: true,
    },
    Attack1: {
      imageSrc: "./assets/img/player/right/Attack1.png",
      frameBuffer: 3,
      frameRate: 4,
    },
    Attack2: {
      imageSrc: "./assets/img/player/right/Attack2.png",
      frameBuffer: 3,
      frameRate: 4,
    },
    Attack3: {
      imageSrc: "./assets/img/player/right/Attack3.png",
      frameBuffer: 3,
      frameRate: 5,
    },
    Attack1Left: {
      imageSrc: "./assets/img/player/left/Attack1.png",
      frameBuffer: 3,
      frameRate: 4,
      revert: true,
    },
    Attack2Left: {
      imageSrc: "./assets/img/player/left/Attack2.png",
      frameBuffer: 3,
      frameRate: 4,
      revert: true,
    },
    Attack3Left: {
      imageSrc: "./assets/img/player/left/Attack3.png",
      frameBuffer: 3,
      frameRate: 5,
      revert: true,
    },
  },
});

function switchSpriteByDirection(spriteRight, spriteLeft) {
  if (player.lastDirection === "right") player.switchSprite(spriteRight);
  else player.switchSprite(spriteLeft);
}

const camera = {
  position: {
    x: 0,
    y: -store.bgImageSize.height + canvas.height,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#212121";

  ctx.save();
  bgCloud.update();
  bgCastle.update();
  ctx.translate(
    camera.position.x,
    camera.position.y + (canvas.height - store.mapImageSize.height + 20)
  );
  map.update();

  player.checkForHorizontalCanvasCollision();
  player.update();
  player.velocity.x = 0;

  if (store.keys.w.presed && !player.jump && !player.fall) {
    player.velocity.y = -11;
    player.jump = true;
  }

  if (store.keys.d.presed) {
    player.velocity.x = 4;
    player.switchSprite("Run");
    player.lastDirection = "right";
    player.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (store.keys.a.presed) {
    player.velocity.x = -4;
    player.switchSprite("RunLeft");
    player.lastDirection = "left";
    player.shouldPanCameraToTheRight({ canvas, camera });
  } else if (store.keys.e.pressed) {
    switch (store.attack.count) {
      case 1:
        switchSpriteByDirection("Attack1", "Attack1Left");
        break;
      case 2:
        switchSpriteByDirection("Attack2", "Attack2Left");
        break;
      case 3:
        switchSpriteByDirection("Attack3", "Attack3Left");
        break;

      default:
        break;
    }
  } else if (player.velocity.y === 0) {
    if (store.attack.count === 1) store.attack.delay++;
    switchSpriteByDirection("Idle", "IdleLeft");
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas });
    switchSpriteByDirection("Jump", "JumpLeft");
  } else if (player.velocity.y > 0) {
    player.fall = true;
    player.shouldPanCameraUp({ camera, canvas });
    switchSpriteByDirection("Fall", "FallLeft");
  }

  ctx.restore();
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      store.keys.w.presed = true;
      break;
    case "d":
      store.keys.d.presed = true;
      break;
    case "a":
      store.keys.a.presed = true;
      break;
    case "e":
      if (
        !store.keys.e.pressed &&
        player.velocity.x === 0 &&
        player.velocity.y === 0
      ) {
        store.keys.e.pressed = true;
        if (
          store.attack.count === store.attack.pattern ||
          store.attack.delay >= store.attack.maxDelay
        ) {
          store.attack.count = 0;
          store.attack.delay = 0;
        }
        store.attack.count++;
      }
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      store.keys.w.presed = false;
      break;
    case "d":
      store.keys.d.presed = false;
      break;
    case "a":
      store.keys.a.presed = false;
      break;

    default:
      break;
  }
});
