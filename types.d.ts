//declare global {
declare let resources: Resources;
declare let input: Input;

declare let Mario: {
	oneonetunnel: () => void;
	Bcoin: typeof Bcoin;
	Star: typeof Star;
	Fireflower: any;
	Mushroom: typeof Mushroom;
	Fireball: typeof Fireball;
	Rubble: typeof Rubble;
	Player: typeof Player;
	Entity: typeof Entity;
	Floor: typeof Floor;
	Goomba: typeof Goomba;
	Koopa: typeof Koopa;
	Coin: typeof Coin;
	Prop: typeof Prop;
	Block: typeof Block;
	Pipe: typeof Pipe;
	Flag: typeof Flag;
	Level: typeof Level;
	Sprite: typeof Sprite

	oneone: () => void;
	oneoneTunner: () => void
}
//}

declare interface Sounds {
	smallJump: HTMLAudioElement;
	bigJump: HTMLAudioElement;
	breakBlock: HTMLAudioElement;
	bump: HTMLAudioElement;
	coin: HTMLAudioElement;
	fireball: HTMLAudioElement;
	flagpole: HTMLAudioElement;
	kick: HTMLAudioElement;
	pipe: HTMLAudioElement;
	itemAppear: HTMLAudioElement;
	powerup: HTMLAudioElement;
	stomp: HTMLAudioElement;
}
declare interface Music {
	overworld: HTMLAudioElement;
	underground: HTMLAudioElement;
	clear: HTMLAudioElement;
	death: HTMLAudioElement;
}



declare class Resources {
	load(resources: string[]): void;
	get(url: string): HTMLImageElement;
	onReady(fn: () => void): void;
	isReady(): boolean;
}

// declare interface Input {
// 	update();
// 	isDown(key: string);
// 	reset();
// }

// declare type Point = { x: number; y: number };
//declare type BoundBox = number[];
declare interface Wall {
	hitbox: BoundBox;
	pos: Point;
}


interface Renderable {
	render(ctx: CanvasRenderingContext2D, vX: number, vY: number): void
}
interface Collidable {
	isCollideWith(entity: Entity): void
}
interface Updateable {
	update(dt: number, v: number): void
}

interface Enemy extends Entity, Renderable, Collidable, Updateable {
	flipping: boolean;
	checkCollisions(): void;
}
// declare interface Entity {

// 	pos: Point;
// 	vel: Point;
// 	standing: boolean;
// 	hitbox: BoundBox;
// 	new(options: EntityOptions);
// 	render(ctx: CanvasRenderingContext2D, vX: number, vY: number);
// 	collideWall(wall: Wall);
// }
// declare interface EntityOptions {
// 	pos: Point;
// 	vec: Point;
// 	sprite: Sprite;
// 	hitbox: BoundBox;
// }
