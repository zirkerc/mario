class Fireflower extends Entity {
    spawning;
    waiting;
    idx;
    targetpos;
    constructor(pos) {
        super({
            pos: pos,
            sprite: level.fireFlowerSprite,
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
        sounds.itemAppear.play();
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
                this.spawning = 0;
            }
        }
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.sprite.update(dt);
    }
    checkCollisions() {
        if (this.spawning) {
            return;
        }
        this.isPlayerCollided();
    }
    isPlayerCollided() {
        //the first two elements of the hitbox array are an offset, so let's do this now.
        var hpos1 = [this.pos.x + this.hitbox[0], this.pos.y + this.hitbox[1]];
        var hpos2 = [player.pos.x + player.hitbox[0], player.pos.y + player.hitbox[1]];
        //if the hitboxes actually overlap
        if (!(hpos1[0] > hpos2[0] + player.hitbox[2] || (hpos1[0] + this.hitbox[2] < hpos2[0]))) {
            if (!(hpos1[1] > hpos2[1] + player.hitbox[3] || (hpos1[1] + this.hitbox[3] < hpos2[1]))) {
                player.powerUp(this.idx);
            }
        }
    }
    //This should never be called, but just in case.
    bump() { }
}
Mario.Fireflower = Fireflower;
