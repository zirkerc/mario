class Bcoin extends Entity {
    idx;
    active;
    targetpos;
    constructor(pos) {
        super({
            pos: pos,
            sprite: level.bcoinSprite(),
            hitbox: new BoundBox(0, 0, 16, 16)
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
        this.vel.y = -12;
        this.targetpos = this.pos.y - 32;
    }
    update(dt) {
        if (!this.active)
            return;
        if (this.vel.y > 0 && this.pos.y >= this.targetpos) {
            player.coins += 1;
            //spawn a score thingy.
            delete level.items[this.idx];
        }
        this.acc.y = 0.75;
        this.vel.y += this.acc.y;
        this.pos.y += this.vel.y;
        this.sprite.update(dt);
    }
    checkCollisions() { ; }
}
Mario.Bcoin = Bcoin;
