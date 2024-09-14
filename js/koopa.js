class Koopa extends Entity {
    dying;
    shell;
    para;
    idx;
    turn;
    flipping;
    frames;
    constructor(pos, sprite, para) {
        //So, funny story. The actual hitboxes don't reach all the way to the ground.
        //What that means is, as long as I use them to keep things on the floor
        //making the hitboxes accurate will make enemies sink into the ground.
        super({
            pos: pos,
            sprite: sprite,
            hitbox: new BoundBox(2, 8, 12, 24)
        });
        this.dying = 0;
        this.shell = 0;
        this.para = para; //para. As in, is it a paratroopa?
        this.vel.x = -0.5;
        this.idx = level.enemies.length;
    }
    render(ctx, vX, vY) {
        this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
    }
    ;
    update(dt, vX) {
        if (this.turn) {
            this.vel.x = -this.vel.x;
            if (this.shell)
                sounds.bump.play();
            this.turn = false;
        }
        if (this.vel.x != 0) {
            this.left = (this.vel.x < 0);
        }
        if (this.left) {
            this.sprite.img = 'sprites/enemy.png';
        }
        else {
            this.sprite.img = 'sprites/enemyr.png';
        }
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
        if (this.shell) {
            if (this.vel.x == 0) {
                this.shell -= 1;
                if (this.shell < 120) {
                    this.sprite.speed = 5;
                }
                if (this.shell == 0) {
                    this.sprite = level.koopaSprite();
                    this.hitbox = new BoundBox(2, 8, 12, 24);
                    if (this.left) {
                        this.sprite.img = 'sprites/enemyr.png';
                        this.vel.x = 0.5;
                        this.left = false;
                    }
                    else {
                        this.vel.x = -0.5;
                        this.left = true;
                    }
                    this.pos.y -= 16;
                }
            }
            else {
                this.shell = 360;
                this.sprite.speed = 0;
                this.sprite.setFrame(0);
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
        //This stops us from flipping twice on the same frame if we collide
        //with multiple wall tiles simultaneously.
        this.turn = true;
    }
    ;
    checkCollisions() {
        var h = this.shell ? 1 : 2;
        if (this.pos.y % 16 !== 0) {
            h += 1;
        }
        var w = this.pos.x % 16 === 0 ? 1 : 2;
        var baseX = Math.floor(this.pos.x / 16);
        var baseY = Math.floor(this.pos.y / 16);
        if (baseY + h > 15) {
            delete level.enemies[this.idx];
            return;
        }
        if (this.flipping) {
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
        var hpos1 = [this.pos.x + this.hitbox.x, this.pos.y + this.hitbox.y];
        var hpos2 = [ent.pos.x + ent.hitbox.x, ent.pos.y + ent.hitbox.y];
        //if the hitboxes actually overlap
        if (!(hpos1[0] > hpos2[0] + ent.hitbox.width || (hpos1[0] + this.hitbox.width < hpos2[0]))) {
            if (!(hpos1[1] > hpos2[1] + ent.hitbox.height || (hpos1[1] + this.hitbox.height < hpos2[1]))) {
                if (ent instanceof Mario.Player) {
                    if (ent.vel.y > 0) {
                        player.bounce = true;
                    }
                    if (this.shell) {
                        sounds.kick.play();
                        if (this.vel.x === 0) {
                            if (ent.left) { //I'm pretty sure this isn't the real logic.
                                this.vel.x = -4;
                            }
                            else {
                                this.vel.x = 4;
                            }
                        }
                        else {
                            if (ent.bounce) {
                                this.vel.x = 0;
                            }
                            else
                                ent.damage();
                        }
                    }
                    else if (ent.vel.y > 0) { //then we get BOPPED.
                        this.stomp();
                    }
                    else { //or the player gets hit
                        ent.damage();
                    }
                }
                else {
                    if (this.shell && (ent instanceof Mario.Goomba)) {
                        ent.bump();
                    }
                    else
                        this.collideWall();
                }
            }
        }
    }
    ;
    stomp() {
        //Turn this thing into a shell if it isn't already. Kick it if it is.
        player.bounce = true;
        if (this.para) {
            this.para = false;
            this.sprite.pos.x -= 32;
        }
        else {
            sounds.stomp.play();
            this.shell = 360;
            this.sprite.pos.x += 64;
            this.sprite.pos.y += 16;
            this.sprite.size = [16, 16];
            this.hitbox = new BoundBox(2, 0, 12, 16);
            this.sprite.speed = 0;
            this.frames = [0, 1];
            this.vel = new Point(0, 0);
            this.pos.y += 16;
        }
    }
    ;
    bump() {
        sounds.kick.play();
        if (this.flipping)
            return;
        this.flipping = true;
        this.sprite.pos = new Point(160, 0);
        this.sprite.size = [16, 16];
        this.hitbox = new BoundBox(2, 0, 12, 16);
        this.sprite.speed = 0;
        this.vel.x = 0;
        this.vel.y = -2.5;
    }
    ;
}
Mario.Koopa = Koopa;
