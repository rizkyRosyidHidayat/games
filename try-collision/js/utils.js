function checkCollisionBlockInteract({ player, collisionBlock }) {
  const verticalInteraction = {
    start: player.position.y + player.height >= collisionBlock.position.y,
    end: player.position.y <= collisionBlock.position.y + collisionBlock.height,
  };
  const horizontalInteraction = {
    start: player.position.x + player.width >= collisionBlock.position.x,
    end: player.position.x <= collisionBlock.position.x + collisionBlock.width,
  };
  return (
    verticalInteraction.start &&
    verticalInteraction.end &&
    horizontalInteraction.start &&
    horizontalInteraction.end
  );
}
