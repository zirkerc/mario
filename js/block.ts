//TODO: clean up the logic for sprite switching.
//TODO: There's a weird bug with the collision logic. Look into it.

interface BlockOptions extends Omit<EntityOptions, "hitbox"> {
  item: any;
  usedSprite?: Sprite;
  bounceSprite?: Sprite;
  breakable?: boolean;
  pos: Point;
}
class Block extends Floor {
  item: any;
  usedSprite: any;
  bounceSprite: any;
  breakable: any;
  opos: any[];
  osprite: any;
  constructor(options: BlockOptions) {
    super(options.pos, options.sprite);
    // super({
    //   pos: options.pos,
    //   sprite: options.sprite,
    //   hitbox: [0, 0, 16, 16]
    // });
    this.item = options.item;
    this.usedSprite = options.usedSprite;
    this.bounceSprite = options.bounceSprite;
    this.breakable = options.breakable;


    this.standing = true;
  }
  break() {
    sounds.breakBlock.play();
    (new Mario.Rubble()).spawn(this.pos);
    var x = this.pos[0] / 16, y = this.pos[1] / 16;
    delete level.blocks[y][x];
  }
  // pos(pos: Point) {
  //   throw new Error("Method not implemented.");
  // }

  bonk(power: number) {
    sounds.bump.play();
    if (power > 0 && this.breakable) {
      this.break();
    } else if (this.standing) {
      this.standing = false;
      if (this.item) {
        this.item.spawn();
        this.item = null;
      }
      this.opos = [];
      this.opos[0] = this.pos[0];
      this.opos[1] = this.pos[1];
      if (this.bounceSprite) {
        this.osprite = this.sprite;
        this.sprite = this.bounceSprite;
      } else {
        this.sprite = this.usedSprite;
      }

      this.vel[1] = -2;
    }
  }

  update(dt, gameTime) {
    if (!this.standing) {
      if (this.pos[1] < this.opos[1] - 8) {
        this.vel[1] = 2;
      }
      if (this.pos[1] > this.opos[1]) {
        this.vel[1] = 0;
        this.pos = this.opos;
        if (this.osprite) {
          this.sprite = this.osprite;
        }
        this.standing = true;
      }
    } else {
      if (this.sprite === this.usedSprite) {
        var x = this.pos[0] / 16, y = this.pos[1] / 16;
        level.statics[y][x] = new Mario.Floor(this.pos, this.usedSprite);
        delete level.blocks[y][x];
      }
    }

    this.pos[1] += this.vel[1];
    this.sprite.update(dt, gameTime);
  }
}
Mario.Block = Block;
