class EntityOptions {
	pos: Point;
	//vec?: Point;
	sprite: Sprite;
	hitbox: BoundBox;
}
class Entity {
	pos: Point;
	vel: Point;
	acc: Point;

	sprite: Sprite;

	left: boolean;
	standing: boolean;
	hitbox: BoundBox;

	constructor(options: EntityOptions) {
		this.vel = [0, 0];
		this.acc = [0, 0];
		this.standing = true;
		this.pos = options.pos;
		this.sprite = options.sprite;
		this.hitbox = options.hitbox;
		this.left = false;
	}

	render(ctx: CanvasRenderingContext2D, vX: number, vY: number) {
		this.sprite.render(ctx, this.pos[0], this.pos[1], vX, vY)
	}

	collideWall(wall: Wall) {
		//the wall will always be a 16x16 block with hitbox = [0,0,16,16].
		if (this.pos[0] > wall.pos[0]) {
			//from the right
			this.pos[0] = wall.pos[0] + wall.hitbox[2] - this.hitbox[0];
			this.vel[0] = Math.max(0, this.vel[0]);
			this.acc[0] = Math.max(0, this.acc[0]);
		} else {
			this.pos[0] = wall.pos[0] + wall.hitbox[0] - this.hitbox[2] - this.hitbox[0];
			this.vel[0] = Math.min(0, this.vel[0]);
			this.acc[0] = Math.min(0, this.acc[0]);
		}
	}

	bump(power?: number) { }
}
Mario.Entity = Entity;

