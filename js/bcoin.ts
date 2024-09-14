class Bcoin extends Entity {
  idx: number;
  active: boolean;
  targetpos: number;

  constructor(pos) {
    super({
      pos: pos,
      sprite: level.bcoinSprite(),
      hitbox: [0, 0, 16, 16]
    });
  }
  //I'm not sure whether it makes sense to use an array for vel and acc here
  //in order to keep with convention, or to just use a single value, since
  //it's literally impossible for these to move left or right.
  spawn() {
    sounds.coin.currentTime = 0.05;
    sounds.coin.play();
    this.idx = level.items.length;
    level.items.push(this);
    this.active = true;
    this.vel[1] = -12;
    this.targetpos = this.pos[1] - 32;
  }

  update(dt: number) {
    if (!this.active) return;

    if (this.vel[1] > 0 && this.pos[1] >= this.targetpos) {
      player.coins += 1;
      //spawn a score thingy.
      delete level.items[this.idx];
    }

    this.acc[1] = 0.75;
    this.vel[1] += this.acc[1];
    this.pos[1] += this.vel[1];
    this.sprite.update(dt);
  }

  checkCollisions() { ; }

}
Mario.Bcoin = Bcoin;
