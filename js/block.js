//TODO: clean up the logic for sprite switching.
//TODO: There's a weird bug with the collision logic. Look into it.
class Block extends Floor {
    item;
    usedSprite;
    bounceSprite;
    breakable;
    opos;
    osprite;
    constructor(options) {
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
        var x = this.pos.x / 16, y = this.pos.y / 16;
        delete level.blocks[y][x];
    }
    // pos(pos: Point) {
    //   throw new Error("Method not implemented.");
    // }
    bonk(power) {
        sounds.bump.play();
        if (power > 0 && this.breakable) {
            this.break();
        }
        else if (this.standing) {
            this.standing = false;
            if (this.item) {
                this.item.spawn();
                this.item = null;
            }
            this.opos = Point.zero();
            this.opos.x = this.pos.x;
            this.opos.y = this.pos.y;
            if (this.bounceSprite) {
                this.osprite = this.sprite;
                this.sprite = this.bounceSprite;
            }
            else {
                this.sprite = this.usedSprite;
            }
            this.vel.y = -2;
        }
    }
    update(dt, gameTime) {
        if (!this.standing) {
            if (this.pos.y < this.opos.y - 8) {
                this.vel.y = 2;
            }
            if (this.pos.y > this.opos.y) {
                this.vel.y = 0;
                this.pos = this.opos;
                if (this.osprite) {
                    this.sprite = this.osprite;
                }
                this.standing = true;
            }
        }
        else {
            if (this.sprite === this.usedSprite) {
                var x = this.pos.x / 16, y = this.pos.y / 16;
                level.statics[y][x] = new Mario.Floor(this.pos, this.usedSprite);
                delete level.blocks[y][x];
            }
        }
        this.pos.y += this.vel.y;
        this.sprite.update(dt, gameTime);
    }
}
Mario.Block = Block;
