class Flag {
    pos;
    hitbox;
    vel;
    acc;
    done;
    hit;
    constructor(pos) {
        //afaik flags always have the same height and Y-position
        this.pos = new Point(pos, 49);
        this.hitbox = [0, 0, 0, 0];
        this.vel = new Point(0, 0);
        this.acc = new Point(0, 0);
    }
    collideWall() {
        ;
    }
    update(dt) {
        if (!this.done && this.pos.y >= 170) {
            this.vel = new Point(0, 0);
            this.pos.y = 170;
            player.exit();
            this.done = true;
        }
        this.pos.y += this.vel.y;
    }
    checkCollisions() {
        this.isPlayerCollided();
    }
    isPlayerCollided() {
        if (this.hit)
            return;
        if (player.pos.x + 8 >= this.pos.x) {
            music.overworld.pause();
            sounds.flagpole.play();
            setTimeout(function () {
                music.clear.play();
            }, 2000);
            this.hit = true;
            player.flag();
            this.vel = new Point(0, 2);
        }
    }
    render() {
        level.flagpoleSprites[2].render(ctx, this.pos.x - 8, this.pos.y, vX, vY);
    }
}
Mario.Flag = Flag;
