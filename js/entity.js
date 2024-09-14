class EntityOptions {
    pos;
    //vec?: Point;
    sprite;
    hitbox;
}
class Entity {
    pos;
    vel;
    acc;
    sprite;
    left;
    standing;
    hitbox;
    constructor(options) {
        this.vel = new Point(0, 0);
        this.acc = new Point(0, 0);
        this.standing = true;
        this.pos = options.pos;
        this.sprite = options.sprite;
        this.hitbox = options.hitbox;
        this.left = false;
    }
    render(ctx, vX, vY) {
        this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
    }
    collideWall(wall) {
        //the wall will always be a 16x16 block with hitbox = [0,0,16,16].
        if (this.pos.x > wall.pos.x) {
            //from the right
            this.pos.x = wall.pos.x + wall.hitbox[2] - this.hitbox[0];
            this.vel.x = Math.max(0, this.vel.x);
            this.acc.x = Math.max(0, this.acc.x);
        }
        else {
            this.pos.x = wall.pos.x + wall.hitbox[0] - this.hitbox[2] - this.hitbox[0];
            this.vel.x = Math.min(0, this.vel.x);
            this.acc.x = Math.min(0, this.acc.x);
        }
    }
    bump(power) { }
}
Mario.Entity = Entity;
