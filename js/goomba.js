//TODO: On console the hitbox is smaller. Measure it and edit this.
class Goomba extends Entity {
    dying;
    idx;
    flipping;
    constructor(pos, sprite) {
        super({
            pos: pos,
            sprite: sprite,
            hitbox: [0, 0, 16, 16]
        });
        this.dying = 0;
        this.vel.x = -0.5;
        this.idx = level.enemies.length;
    }
    render(ctx, vX, vY) {
        this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
    }
    ;
    update(dt, vX) {
        if (this.pos.x - vX > 336) { //if we're too far away, do nothing.
            return;
        }
        else if (this.pos.x - vX < -32) {
            delete level.enemies[this.idx];
        }
        if (this.dying) {
            this.dying -= 1;
            if (!this.dying) {
                delete level.enemies[this.idx];
            }
        }
        this.acc.y = 0.2;
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.sprite.update(dt);
    }
    ;
    collideWall() {
        this.vel.x = -this.vel.x;
    }
    ;
    checkCollisions() {
        if (this.flipping) {
            return;
        }
        var h = this.pos.y % 16 === 0 ? 1 : 2;
        var w = this.pos.x % 16 === 0 ? 1 : 2;
        var baseX = Math.floor(this.pos.x / 16);
        var baseY = Math.floor(this.pos.y / 16);
        if (baseY + h > 15) {
            delete level.enemies[this.idx];
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
            if (enemy === that) { //don't check collisions with ourselves.
                return;
            }
            else if (enemy.pos.x - vX > 336) { //stop checking once we get to far away dudes.
                return;
            }
            else {
                that.isCollideWith(enemy);
            }
        });
        this.isCollideWith(player);
    }
    ;
    isCollideWith(ent) {
        if (ent instanceof Mario.Player && (this.dying || ent.invincibility)) {
            return;
        }
        //the first two elements of the hitbox array are an offset, so let's do this now.
        var hpos1 = [this.pos.x + this.hitbox[0], this.pos.y + this.hitbox[1]];
        var hpos2 = [ent.pos.x + ent.hitbox[0], ent.pos.y + ent.hitbox[1]];
        //if the hitboxes actually overlap
        if (!(hpos1[0] > hpos2[0] + ent.hitbox[2] || (hpos1[0] + this.hitbox[2] < hpos2[0]))) {
            if (!(hpos1[1] > hpos2[1] + ent.hitbox[3] || (hpos1[1] + this.hitbox[3] < hpos2[1]))) {
                if (ent instanceof Mario.Player) { //if we hit the player
                    if (ent.vel.y > 0) { //then the goomba dies
                        this.stomp();
                    }
                    else if (ent.starTime) {
                        this.bump();
                    }
                    else { //or the player gets hit
                        ent.damage();
                    }
                }
                else {
                    this.collideWall();
                }
            }
        }
    }
    ;
    stomp() {
        sounds.stomp.play();
        player.bounce = true;
        this.sprite.pos.x = 32;
        this.sprite.speed = 0;
        this.vel.x = 0;
        this.dying = 10;
    }
    ;
    bump() {
        sounds.kick.play();
        this.sprite.img = 'sprites/enemyr.png';
        this.flipping = true;
        this.pos.y -= 1;
        this.vel.x = 0;
        this.vel.y = -2.5;
    }
    ;
}
Mario.Goomba = Goomba;
