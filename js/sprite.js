class Sprite {
    pos;
    size;
    speed;
    _index;
    img;
    once;
    frames;
    lastUpdated;
    done;
    constructor(img, pos, size, speed, frames, once) {
        this.pos = pos;
        this.size = size;
        this.speed = speed;
        this._index = 0;
        this.img = img;
        this.once = once;
        this.frames = frames;
    }
    update(dt, gameTime) {
        if (gameTime && gameTime == this.lastUpdated)
            return;
        this._index += this.speed * dt;
        if (gameTime)
            this.lastUpdated = gameTime;
    }
    setFrame(frame) {
        this._index = frame;
    }
    render(ctx, posx, posy, vX, vY) {
        var frame;
        if (this.speed > 0) {
            var max = this.frames.length;
            var idx = Math.floor(this._index);
            frame = this.frames[idx % max];
            if (this.once && idx >= max) {
                this.done = true;
                return;
            }
        }
        else {
            frame = 0;
        }
        var x = this.pos.x;
        var y = this.pos.y;
        x += frame * this.size[0];
        ctx.drawImage(resources.get(this.img), x + (1 / 3), y + (1 / 3), this.size[0] - (2 / 3), this.size[1] - (2 / 3), Math.round(posx - vX), Math.round(posy - vY), this.size[0], this.size[1]);
    }
}
Mario.Sprite = Sprite;
