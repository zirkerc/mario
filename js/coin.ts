class Coin extends Entity {
  idx: number;
  constructor(pos: Point, sprite: Sprite) {
    super({
      pos: pos,
      sprite: sprite,
      hitbox: new BoundBox(0, 0, 16, 16)
    });
    this.idx = level.items.length
  }
  isPlayerCollided() {
    //the first two elements of the hitbox array are an offset, so let's do this now.
    var hpos1 = [this.pos.x + this.hitbox.x, this.pos.y + this.hitbox.y];
    var hpos2 = [player.pos.x + player.hitbox.x, player.pos.y + player.hitbox.y];

    //if the hitboxes actually overlap
    if (!(hpos1[0] > hpos2[0] + player.hitbox.width || (hpos1[0] + this.hitbox.width < hpos2[0]))) {
      if (!(hpos1[1] > hpos2[1] + player.hitbox.height || (hpos1[1] + this.hitbox.height < hpos2[1]))) {
        this.collect();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, vX: number, vY: number) {
    this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
  }

  //money is not affected by gravity, you see.
  update(dt: number) {
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
