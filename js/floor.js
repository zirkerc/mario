class Floor extends Entity {
    constructor(pos, sprite) {
        super({
            pos: pos,
            sprite: sprite,
            hitbox: new BoundBox(0, 0, 16, 16)
        });
    }
    isCollideWith(ent) {
        //the first two elements of the hitbox array are an offset, so let's do this now.
        var hpos1 = [Math.floor(this.pos.x + this.hitbox.x), Math.floor(this.pos.y + this.hitbox.y)];
        var hpos2 = [Math.floor(ent.pos.x + ent.hitbox.x), Math.floor(ent.pos.y + ent.hitbox.y)];
        //if the hitboxes actually overlap
        if (!(hpos1[0] > hpos2[0] + ent.hitbox.width || (hpos1[0] + this.hitbox.width < hpos2[0]))) {
            if (!(hpos1[1] > hpos2[1] + ent.hitbox.height || (hpos1[1] + this.hitbox.height < hpos2[1]))) {
                if (!this.standing) {
                    ent.bump();
                }
                else {
                    //if the entity is over the block, it's basically floor
                    var center = hpos2[0] + ent.hitbox.width / 2;
                    if (Math.abs(hpos2[1] + ent.hitbox.height - hpos1[1]) <= ent.vel.y) {
                        if (level.statics[(this.pos.y / 16) - 1][this.pos.x / 16]) {
                            return;
                        }
                        ;
                        ent.vel.y = 0;
                        ent.pos.y = hpos1[1] - ent.hitbox.height - ent.hitbox.y;
                        ent.standing = true;
                        if (ent instanceof Mario.Player) {
                            ent.jumping = 0;
                        }
                    }
                    else if (Math.abs(hpos2[1] - hpos1[1] - this.hitbox.height) > ent.vel.y &&
                        center + 2 >= hpos1[0] && center - 2 <= hpos1[0] + this.hitbox.width) {
                        //ent is under the block.
                        ent.vel.y = 0;
                        ent.pos.y = hpos1[1] + this.hitbox.height;
                        if (ent instanceof Mario.Player) {
                            this.bonk(ent.power);
                            ent.jumping = 0;
                        }
                    }
                    else {
                        //entity is hitting it from the side, we're a wall
                        ent.collideWall(this);
                    }
                }
            }
        }
    }
    bonk(power) { }
}
Mario.Floor = Floor;
