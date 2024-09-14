//props do even less than entities, so they don't need to inherit really
class Prop {
    pos;
    sprite;
    constructor(pos, sprite) {
        this.pos = pos;
        this.sprite = sprite;
    }
    //but we will be using the same Render, more or less.
    render(ctx, vX, vY) {
        this.sprite.render(ctx, this.pos.x, this.pos.y, vX, vY);
    }
}
Mario.Prop = Prop;
