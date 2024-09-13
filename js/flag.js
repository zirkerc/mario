class Flag {
  constructor(pos) {
    //afaik flags always have the same height and Y-position
    this.pos = [pos, 49];
    this.hitbox = [0, 0, 0, 0];
    this.vel = [0, 0];
    this.acc = [0, 0];
  }

  collideWall() {
    ;
  }

  update(dt) {
    if (!this.done && this.pos[1] >= 170) {
      this.vel = [0, 0];
      this.pos[1] = 170;
      player.exit();
      this.done = true;
    }
    this.pos[1] += this.vel[1];
  }

  checkCollisions() {
    this.isPlayerCollided();
  }

  isPlayerCollided() {
    if (this.hit) return;
    if (player.pos[0] + 8 >= this.pos[0]) {
      music.overworld.pause();
      sounds.flagpole.play();
      setTimeout(function () {
        music.clear.play();
      }, 2000);
      this.hit = true;
      player.flag();
      this.vel = [0, 2];
    }
  }

  render() {
    level.flagpoleSprites[2].render(ctx, this.pos[0] - 8, this.pos[1], vX, vY);
  }
}

Mario.Flag = Flag;