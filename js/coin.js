class Coin extends Entity {
  constructor(pos, sprite) {
    super({
      pos: pos,
      sprite: sprite,
      hitbox: [0, 0, 16, 16]
    });
    this.idx = level.items.length
  }
  isPlayerCollided() {
    //the first two elements of the hitbox array are an offset, so let's do this now.
    var hpos1 = [this.pos[0] + this.hitbox[0], this.pos[1] + this.hitbox[1]];
    var hpos2 = [player.pos[0] + player.hitbox[0], player.pos[1] + player.hitbox[1]];

    //if the hitboxes actually overlap
    if (!(hpos1[0] > hpos2[0] + player.hitbox[2] || (hpos1[0] + this.hitbox[2] < hpos2[0]))) {
      if (!(hpos1[1] > hpos2[1] + player.hitbox[3] || (hpos1[1] + this.hitbox[3] < hpos2[1]))) {
        this.collect();
      }
    }
  }

  render(ctx, vX, vY) {
    this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY);
  }

  //money is not affected by gravity, you see.
  update(dt) {
    this.sprite.update(dt);
  }
  checkCollisions() {
    this.isPlayerCollided();
  }

  collect() {
    sounds.coin.currentTime = 0.05;
    sounds.coin.play();
    player.coins += 1;
    delete level.items[this.idx]
  }
}
Mario.Coin = Coin;
