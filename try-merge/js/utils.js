function checkCollisionBlockInteract({ player, collisionBlock }) {
  const verticalInteraction = {
    bottom: player.position.y + player.height >= collisionBlock.position.y,
    top: player.position.y <= collisionBlock.position.y + collisionBlock.height,
  };
  const horizontalInteraction = {
    right: player.position.x + player.width >= collisionBlock.position.x,
    left: player.position.x <= collisionBlock.position.x + collisionBlock.width,
  };
  return (
    verticalInteraction.bottom &&
    verticalInteraction.top &&
    horizontalInteraction.right &&
    horizontalInteraction.left
  );
}
