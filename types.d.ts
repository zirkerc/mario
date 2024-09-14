//declare global {
declare let resources: Resources;
declare let input: Input;

declare let Mario: {
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
	load(resources: string[]);
	get(url: string);
	onReady(fn: () => void);
	isReady();
}

// declare interface Input {
// 	update();
// 	isDown(key: string);
// 	reset();
// }

declare type Point = number[];
declare type BoundBox = number[];
declare interface Wall {
	hitbox: BoundBox;
	pos: Point;
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
