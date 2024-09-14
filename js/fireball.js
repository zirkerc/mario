class Fireball extends Entity {
    hit;
    idx;
    constructor(pos) {
        super({
            pos: pos,
            sprite: new Mario.Sprite('sprites/items.png', new Point(96, 144), [8, 8], 5, [0, 1, 2, 3]),
            hitbox: new BoundBox(0, 0, 8, 8)
        });
        this.hit = 0;
        this.standing = false;
    }
    spawn(left) {
        sounds.fireball.currentTime = 0;
        sounds.fireball.play();
        if (fireballs[0]) {
            this.idx = 1;
            fireballs[1] = this;
        }
        else {
            this.idx = 0;
            fireballs[0] = this;
        }
        this.vel.x = (left ? -5 : 5);
        this.standing = false;
        this.vel.y = 0;
    }
    render(ctx, vX, vY) {
        this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
    }
    update(dt) {
        if (this.hit == 1) {
            this.sprite.pos = new Point(96, 160);
            this.sprite.size = [16, 16];
            this.sprite.frames = [0, 1, 2];
            this.sprite.speed = 8;
            this.hit += 1;
            return;
        }
        else if (this.hit == 5) {
            delete fireballs[this.idx];
            player.fireballs -= 1;
            return;
        }
        else if (this.hit) {
            this.hit += 1;
            return;
        }
        //In retrospect, the way collision is being handled is RIDICULOUS
        //but I don't have to use some horrible kludge for this.
        if (this.standing) {
            this.standing = false;
            this.vel.y = -4;
        }
        this.acc.y = 0.5;
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        if (this.pos.x < vX || this.pos.x > vX + 256) {
            this.hit = 1;
        }
        this.sprite.update(dt);
    }
    collideWall() {
        if (!this.hit)
            this.hit = 1;
    }
    checkCollisions() {
        if (this.hit)
            return;
        var h = this.pos.y % 16 < 8 ? 1 : 2;
        var w = this.pos.x % 16 < 8 ? 1 : 2;
        var baseX = Math.floor(this.pos.x / 16);
        var baseY = Math.floor(this.pos.y / 16);
        if (baseY + h > 15) {
            delete fireballs[this.idx];
            player.fireballs -= 1;
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
        var that = this;
        level.enemies.forEach(function (enemy) {
            if (enemy.flipping || enemy.pos.x - vX > 336) { //stop checking once we get to far away dudes.
                return;
            }
            else {
                that.isCollideWith(enemy);
            }
        });
    }
    isCollideWith(ent) {
        //the first two elements of the hitbox array are an offset, so let's do this now.
        var hpos1 = [this.pos.x + this.hitbox.x, this.pos.y + this.hitbox.y];
        var hpos2 = [ent.pos.x + ent.hitbox.x, ent.pos.y + ent.hitbox.y];
        //if the hitboxes actually overlap
        if (!(hpos1[0] > hpos2[0] + ent.hitbox.width || (hpos1[0] + this.hitbox.width < hpos2[0]))) {
            if (!(hpos1[1] > hpos2[1] + ent.hitbox.height || (hpos1[1] + this.hitbox.height < hpos2[1]))) {
                this.hit = 1;
                ent.bump();
            }
        }
    }
    ;
    bump() { }
}
Mario.Fireball = Fireball;
