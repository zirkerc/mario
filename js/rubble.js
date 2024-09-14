//TODO: make each rubble an entity, use that render and write in Entity.update
class Rubble {
    sprites;
    poss;
    vels;
    idx;
    constructor() {
        this.sprites = [];
        this.poss = [];
        this.vels = [];
    }
    spawn(pos) {
        this.idx = level.items.length;
        level.items.push(this);
        this.sprites[0] = level.rubbleSprite();
        this.sprites[1] = level.rubbleSprite();
        this.sprites[2] = level.rubbleSprite();
        this.sprites[3] = level.rubbleSprite();
        this.poss[0] = pos;
        this.poss[1] = new Point(pos.x + 8, pos.y);
        this.poss[2] = new Point(pos.x, pos.y + 8);
        this.poss[3] = new Point(pos.x + 8, pos.y + 8);
        this.vels[0] = new Point(-1.25, -5);
        this.vels[1] = new Point(1.25, -5);
        this.vels[2] = new Point(-1.25, -3);
        this.vels[3] = new Point(1.25, -3);
    }
    update(dt) {
        for (var i = 0; i < 4; i++) {
            if (this.sprites[i] === undefined)
                continue;
            this.vels[i].y += .3;
            this.poss[i].x += this.vels[i].x;
            this.poss[i].y += this.vels[i].y;
            this.sprites[i].update(dt);
            if (this.poss[i].y > 256) {
                delete this.sprites[i];
            }
        }
        if (this.sprites.every(function (el) { return !el; })) {
            delete level.items[this.idx];
        }
    }
    //You might argue that things that can't collide are more like scenery
    //but these move and need to be deleted, and i'd rather deal with the 1d array.
    checkCollisions() { ; }
    render() {
        for (var i = 0; i < 4; i++) {
            if (this.sprites[i] === undefined)
                continue;
            this.sprites[i].render(ctx, this.poss[i].x, this.poss[i].y, vX, vY);
        }
    }
}
Mario.Rubble = Rubble;
