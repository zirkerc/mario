class Bcoin extends Entity {
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
    this.vel = -12;
    this.targetpos = this.pos[1] - 32;
  }

  update(dt) {
    if (!this.active) return;

    if (this.vel > 0 && this.pos[1] >= this.targetpos) {
      player.coins += 1;
      //spawn a score thingy.
      delete level.items[this.idx];
    }

    this.acc = 0.75;
    this.vel += this.acc;
    this.pos[1] += this.vel;
    this.sprite.update(dt);
  }

  checkCollisions() { ; }

}
Mario.Bcoin = Bcoin;
