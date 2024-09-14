class Point {
	static zero() {
		return new Point();
	}

	constructor(x?: number, y?: number) {
		this.x = x;
		this.y = y;
	}
	x: number = 0;
	y: number = 0;

}
