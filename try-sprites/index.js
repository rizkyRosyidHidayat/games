const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 576;

const player = new Player({
  position: {
    x: 100,
    y: 100,
  },
  imageSrc: './sprites/right/Idle.png',
  frameRate: 11,
  animations: {
    Idle: {
      imageSrc: './sprites/right/Idle.png',
      frameBuffer: 4,
      frameRate: 11,
    },
    IdleLeft: {
      imageSrc: './sprites/left/Idle.png',
      frameBuffer: 4,
      frameRate: 11,
      revert: true,
    },
    Run: {
      imageSrc: './sprites/right/Run.png',
      frameBuffer: 4,
      frameRate: 8,
    },
    RunLeft: {
      imageSrc: './sprites/left/Run.png',
      frameBuffer: 4,
      frameRate: 8,
      revert: true,
    },
    Jump: {
      imageSrc: './sprites/right/Jump.png',
      frameBuffer: 4,
      frameRate: 3,
    },
    Fall: {
      imageSrc: './sprites/right/Fall.png',
      frameBuffer: 4,
      frameRate: 3,
    },
    JumpLeft: {
      imageSrc: './sprites/left/Jump.png',
      frameBuffer: 4,
      frameRate: 3,
      revert: true,
    },
    FallLeft: {
      imageSrc: './sprites/left/Fall.png',
      frameBuffer: 4,
      frameRate: 3,
      revert: true,
    },
    Attack1: {
      imageSrc: './sprites/right/Attack1.png',
      frameBuffer: 2,
      frameRate: 7,
    },
    Attack2: {
      imageSrc: './sprites/right/Attack2.png',
      frameBuffer: 2,
      frameRate: 7,
    },
    Attack1Left: {
      imageSrc: './sprites/left/Attack1.png',
      frameBuffer: 2,
      frameRate: 7,
      revert: true,
    },
    Attack2Left: {
      imageSrc: './sprites/left/Attack2.png',
      frameBuffer: 2,
      frameRate: 7,
      revert: true,
    },
  },
});

function switchSpriteByDirection(spriteRight, spriteLeft) {
  if (player.lastDirection === 'right') player.switchSprite(spriteRight);
  else player.switchSprite(spriteLeft);
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = '#212121';
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
  player.update();
  if (keys.d.pressed) {
    player.switchSprite('Run');
    player.lastDirection = 'right';
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft');
    player.lastDirection = 'left';
  } else if (keys.q.pressed) {
    switch (attack.count) {
      case 1:
        switchSpriteByDirection('Attack1', 'Attack1Left');
        break;
      case 2:
        switchSpriteByDirection('Attack2', 'Attack2Left');
        break;

      default:
        break;
    }
  } else if (keys.w.pressed) {
    if (player.jumpHeight <= maxJumpHeight) {
      switchSpriteByDirection('Jump', 'JumpLeft');
      player.jumpHeight += 3;
    } else {
      switchSpriteByDirection('Fall', 'FallLeft');
    }
  } else {
    switchSpriteByDirection('Idle', 'IdleLeft');
    player.jumpHeight = 0;
    if (attack.count === 1) attack.delay++;
    if (attack.count === attack.pattern || attack.delay >= attack.maxDelay) {
      attack.count = 0;
      attack.delay = 0;
    }
  }
  c.restore();
}

animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      break;
    case 'a':
      keys.a.pressed = true;
      break;
    case 'w':
      keys.w.pressed = true;
      break;
    case 'q':
      if (!keys.q.pressed) {
        keys.q.pressed = true;
        attack.count++;
      }
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
  }
});
