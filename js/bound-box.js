class BoundBox extends Point {
    width;
    height;
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
}
class Size {
    width;
    height;
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
