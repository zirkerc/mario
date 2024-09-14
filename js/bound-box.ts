class BoundBox extends Point {
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		super(x, y);
		this.width = width;
		this.height = height;
	}
}


class Size {
	width: number;
	height: number;
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}
}
