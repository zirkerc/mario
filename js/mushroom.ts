class Mushroom extends Entity {
  spawning: number;
  waiting: number;
  idx: number;
  targetpos: Point;
  constructor(pos: Point) {
    super({
      pos: pos,
      sprite: level.superShroomSprite,
      hitbox: new BoundBox(0, 0, 16, 16)
    });
    this.spawning = 0;
    this.waiting = 0;
  }
  render(ctx: CanvasRenderingContext2D, vX: number, vY: number) {
    if (this.spawning > 1) return;
    this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
  }

  spawn() {
    if (player.power > 0) {
      //replace this with a fire flower
      var ff = new Mario.Fireflower(this.pos)
      ff.spawn();
      return;
    }
    sounds.itemAppear.play();
    this.idx = level.items.length;
    level.items.push(this);
    this.spawning = 12;
    this.targetpos = new Point();
    this.targetpos.x = this.pos.x;
    this.targetpos.y = this.pos.y - 16;
  }

  update(dt: number) {
    if (this.spawning > 1) {
      this.spawning -= 1;
      if (this.spawning == 1) this.vel.y = -.5;
      return;
    }
    if (this.spawning) {
      if (this.pos.y <= this.targetpos.y) {
        this.pos.y = this.targetpos.y;
        this.vel.y = 0;
        this.waiting = 5;
        this.spawning = 0;
        this.vel.x = 1;
      }
    } else {
      this.acc.y = 0.2;
    }

    if (this.waiting) {
      this.waiting -= 1;
    } else {
      this.vel.y += this.acc.y;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.sprite.update(dt);
    }
  }

  collideWall() {
    this.vel.x = -this.vel.x;
  }

  checkCollisions() {
    if (this.spawning) {
      return;
    }
    var h = this.pos.y % 16 == 0 ? 1 : 2;
    var w = this.pos.x % 16 == 0 ? 1 : 2;

    var baseX = Math.floor(this.pos.x / 16);
    var baseY = Math.floor(this.pos.y / 16);

    if (baseY + h > 15) {
      delete level.items[this.idx];
      return;
    }

    for (var i = 0; i < h; i++) {
      for (var j = 0; j < w; j++) {
        if (level.statics[baseY + i][baseX + j]) {
          level.statics[baseY + i][baseX + j].isCollideWith(this);
        }
        if (level.blocks[baseY + i][baseX + j]) {
          level.blocks[baseY + i][baseX + j].isCollideWith(this);
        }
      }
    }

    this.isPlayerCollided();
  }

  //we have access to player everywhere, so let's just do this.
  isPlayerCollided() {
    //the first two elements of the hitbox array are an offset, so let's do this now.
    var hpos1 = [this.pos.x + this.hitbox.x, this.pos.y + this.hitbox.y];
    var hpos2 = [player.pos.x + player.hitbox.x, player.pos.y + player.hitbox.y];

    //if the hitboxes actually overlap
    if (!(hpos1[0] > hpos2[0] + player.hitbox.width || (hpos1[0] + this.hitbox.width < hpos2[0]))) {
      if (!(hpos1[1] > hpos2[1] + player.hitbox.height || (hpos1[1] + this.hitbox.height < hpos2[1]))) {
        player.powerUp(this.idx);
      }
    }
  }

  bump() {
    this.vel.y = -2;
  }
}
Mario.Mushroom = Mushroom;
