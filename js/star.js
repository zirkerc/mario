class Star extends Entity {
    spawning;
    waiting;
    idx;
    targetpos;
    constructor(pos) {
        super({
            pos: pos,
            sprite: level.starSprite,
            hitbox: [0, 0, 16, 16]
        });
        this.spawning = 0;
        this.waiting = 0;
    }
    render(ctx, vX, vY) {
        if (this.spawning > 1)
            return;
        this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
    }
    spawn() {
        this.idx = level.items.length;
        level.items.push(this);
        this.spawning = 12;
        this.targetpos = new Point();
        this.targetpos.x = this.pos.x;
        this.targetpos.y = this.pos.y - 16;
    }
    update(dt) {
        if (this.spawning > 1) {
            this.spawning -= 1;
            if (this.spawning == 1)
                this.vel.y = -.5;
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
        }
        else {
            this.acc.y = 0.2;
        }
        if (this.standing) {
            this.standing = false;
            this.vel.y = -3;
        }
        if (this.waiting) {
            this.waiting -= 1;
        }
        else {
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
        var hpos1 = [this.pos.x + this.hitbox[0], this.pos.y + this.hitbox[1]];
        var hpos2 = [player.pos.x + player.hitbox[0], player.pos.y + player.hitbox[1]];
        //if the hitboxes actually overlap
        if (!(hpos1[0] > hpos2[0] + player.hitbox[2] || (hpos1[0] + this.hitbox[2] < hpos2[0]))) {
            if (!(hpos1[1] > hpos2[1] + player.hitbox[3] || (hpos1[1] + this.hitbox[3] < hpos2[1]))) {
                player.star(this.idx);
            }
        }
    }
    bump() {
        this.vel.y = -2;
    }
}
Mario.Star = Star;
