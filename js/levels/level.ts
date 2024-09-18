interface LevelOptions {
  playerPos?: Point;
  scrolling: boolean;
  loader: () => void;
  background: string;
  exit?: number;
  floorSprite: Sprite;
  cloudSprite?: Sprite;
  wallSprite: Sprite;
  brickSprite: Sprite;
  rubbleSprite?: () => Sprite;
  brickBounceSprite: Sprite;
  ublockSprite: Sprite;
  superShroomSprite?: Sprite;
  fireFlowerSprite?: Sprite;
  starSprite?: Sprite;
  coinSprite?: () => Sprite;
  bcoinSprite?: () => Sprite;
  goombaSprite?: () => Sprite;
  koopaSprite?: () => Sprite;
  pipeLEndSprite: Sprite;
  pipeREndSprite: Sprite;
  pipeLMidSprite: Sprite;
  pipeRMidSprite: Sprite;
  pipeUpMid: Sprite;
  pipeSideMid: Sprite;
  pipeLeft: Sprite;
  pipeTop: Sprite;
  flagPoleSprites?: Sprite[];
  LPipeSprites?: Sprite[];
  cloudSprites?: Sprite[];
  hillSprites?: Sprite[];
  bushSprite?: Sprite;
  bushSprites?: Sprite[];
  qblockSprite?: Sprite;
  invincibility?: number[];
}
class Level {
  playerPos: Point;
  scrolling: boolean;
  loader: () => void;
  background: string;
  exit: number;
  floorSprite: Sprite;
  cloudSprite: Sprite;
  wallSprite: Sprite;
  brickSprite: Sprite;
  rubbleSprite: () => Sprite;
  brickBounceSprite: Sprite;
  ublockSprite: Sprite;
  superShroomSprite: Sprite;
  fireFlowerSprite: Sprite;
  starSprite: Sprite;
  coinSprite: () => Sprite;
  bcoinSprite: () => Sprite;
  goombaSprite: () => Sprite;
  koopaSprite: () => Sprite;
  pipeLEndSprite: Sprite;
  pipeREndSprite: Sprite;
  pipeLMidSprite: Sprite;
  pipeRMidSprite: Sprite;
  pipeUpMid: any;
  pipeSideMid: any;
  pipeLeft: any;
  pipeTop: any;
  flagpoleSprites: Sprite[];
  LPipeSprites: Sprite[];
  cloudSprites: Sprite[];
  hillSprites: Sprite[];
  bushSprite: Sprite;
  bushSprites: Sprite[];
  qblockSprite: Sprite;
  invincibility: number[];
  statics: (Renderable & Collidable)[][];
  scenery: Renderable[][];
  blocks: (Renderable & Collidable & Updateable)[][];
  enemies: Enemy[];
  items: any[];
  pipes: Pipe[];

  constructor(options: LevelOptions) {
    this.playerPos = options.playerPos ?? Point.zero();
    this.scrolling = options.scrolling;
    this.loader = options.loader;
    this.background = options.background;
    this.exit = options.exit;

    this.floorSprite = options.floorSprite;
    this.cloudSprite = options.cloudSprite;
    this.wallSprite = options.wallSprite;
    this.brickSprite = options.brickSprite;
    this.rubbleSprite = options.rubbleSprite;
    this.brickBounceSprite = options.brickBounceSprite;
    this.ublockSprite = options.ublockSprite;
    this.superShroomSprite = options.superShroomSprite;
    this.fireFlowerSprite = options.fireFlowerSprite;
    this.starSprite = options.starSprite;
    this.coinSprite = options.coinSprite;
    this.bcoinSprite = options.bcoinSprite;
    this.goombaSprite = options.goombaSprite;
    this.koopaSprite = options.koopaSprite;

    //prop pipe sprites, to be phased out
    this.pipeLEndSprite = options.pipeLEndSprite;
    this.pipeREndSprite = options.pipeREndSprite;
    this.pipeLMidSprite = options.pipeLMidSprite;
    this.pipeRMidSprite = options.pipeRMidSprite;

    //real pipe sprites, use these.
    this.pipeUpMid = options.pipeUpMid;
    this.pipeSideMid = options.pipeSideMid;
    this.pipeLeft = options.pipeLeft;
    this.pipeTop = options.pipeTop;

    this.flagpoleSprites = options.flagPoleSprites;

    this.LPipeSprites = options.LPipeSprites;
    this.cloudSprites = options.cloudSprites;
    this.hillSprites = options.hillSprites;
    this.bushSprite = options.bushSprite;
    this.bushSprites = options.bushSprites;
    this.qblockSprite = options.qblockSprite;

    this.invincibility = options.invincibility;
    this.statics = [];
    this.scenery = [];
    this.blocks = [];
    this.enemies = [];
    this.items = [];
    this.pipes = [];

    for (var i = 0; i < 15; i++) {
      this.statics[i] = [];
      this.scenery[i] = [];
      this.blocks[i] = [];
    }

  };

  putFloor(start: number, end: number) {
    for (var i = start; i < end; i++) {
      this.statics[13][i] = new Mario.Floor(new Point(16 * i, 208), this.floorSprite);
      this.statics[14][i] = new Mario.Floor(new Point(16 * i, 224), this.floorSprite);
    }
  };

  putGoomba(x: number, y: number) {
    this.enemies.push(new Mario.Goomba(new Point(16 * x, 16 * y), this.goombaSprite()));
  };

  putKoopa(x: number, y: number, para = false) {
    this.enemies.push(new Mario.Koopa(new Point(16 * x, 16 * y), this.koopaSprite(), para));
  };

  putWall(x: number, y: number, height: number) {
    //y is the bottom of the wall in this case.
    for (var i = y - height; i < y; i++) {
      this.statics[i][x] = new Mario.Floor(new Point(16 * x, 16 * i), this.wallSprite);
    }
  };

  putPipe(x: number, y: number, height: number) {
    for (var i = y - height; i < y; i++) {
      if (i === y - height) {
        this.statics[i][x] = new Mario.Floor(new Point(16 * x, 16 * i), this.pipeLEndSprite);
        this.statics[i][x + 1] = new Mario.Floor(new Point(16 * x + 16, 16 * i), this.pipeREndSprite);
      } else {
        this.statics[i][x] = new Mario.Floor(new Point(16 * x, 16 * i), this.pipeLMidSprite);
        this.statics[i][x + 1] = new Mario.Floor(new Point(16 * x + 16, 16 * i), this.pipeRMidSprite);
      }
    }
  };

  //sometimes, pipes don't go straight up and down.
  putLeftPipe(x: number, y: number) {
    this.statics[y][x] = new Mario.Floor(new Point(16 * x, 16 * y), this.LPipeSprites[0]);
    this.statics[y + 1][x] = new Mario.Floor(new Point(16 * x, 16 * (y + 1)), this.LPipeSprites[1]);
    this.statics[y][x + 1] = new Mario.Floor(new Point(16 * (x + 1), 16 * y), this.LPipeSprites[2]);
    this.statics[y + 1][x + 1] = new Mario.Floor(new Point(16 * (x + 1), 16 * (y + 1)), this.LPipeSprites[3]);
    this.statics[y][x + 2] = new Mario.Floor(new Point(16 * (x + 2), 16 * y), this.LPipeSprites[4]);
    this.statics[y + 1][x + 2] = new Mario.Floor(new Point(16 * (x + 2), 16 * (y + 1)), this.LPipeSprites[5]);
  };

  putCoin(x: number, y: number) {
    this.items.push(new Mario.Coin(
      new Point(x * 16, y * 16),
      this.coinSprite()
    ));
  };

  putCloud(x: number, y: number) {
    this.scenery[y][x] = new Mario.Prop(new Point(x * 16, y * 16), this.cloudSprite);
  };

  putQBlock(x: number, y: number, item: any) {
    this.blocks[y][x] = new Mario.Block({
      pos: new Point(x * 16, y * 16),
      item: item,
      sprite: this.qblockSprite,
      usedSprite: this.ublockSprite
    });
  };

  putBrick(x: number, y: number, item: any) {
    this.blocks[y][x] = new Mario.Block({
      pos: new Point(x * 16, y * 16),
      item: item,
      sprite: this.brickSprite,
      bounceSprite: this.brickBounceSprite,
      usedSprite: this.ublockSprite,
      breakable: !item
    });
  };

  putBigHill(x: number, y: number) {
    var px = x * 16, py = y * 16;
    this.scenery[y][x] = new Mario.Prop(new Point(px, py), this.hillSprites[0]);
    this.scenery[y][x + 1] = new Mario.Prop(new Point(px + 16, py), this.hillSprites[3]);
    this.scenery[y - 1][x + 1] = new Mario.Prop(new Point(px + 16, py - 16), this.hillSprites[0]);
    this.scenery[y][x + 2] = new Mario.Prop(new Point(px + 32, py), this.hillSprites[4]);
    this.scenery[y - 1][x + 2] = new Mario.Prop(new Point(px + 32, py - 16), this.hillSprites[3]);
    this.scenery[y - 2][x + 2] = new Mario.Prop(new Point(px + 32, py - 32), this.hillSprites[1]);
    this.scenery[y][x + 3] = new Mario.Prop(new Point(px + 48, py), this.hillSprites[5]);
    this.scenery[y - 1][x + 3] = new Mario.Prop(new Point(px + 48, py - 16), this.hillSprites[2]);
    this.scenery[y][x + 4] = new Mario.Prop(new Point(px + 64, py), this.hillSprites[2]);
  };

  putBush(x: number, y: number) {
    this.scenery[y][x] = new Mario.Prop(new Point(x * 16, y * 16), this.bushSprite);
  };

  putThreeBush(x: number, y: number) {
    let px = x * 16;
    let py = y * 16;
    this.scenery[y][x] = new Mario.Prop(new Point(px, py), this.bushSprites[0]);
    this.scenery[y][x + 1] = new Mario.Prop(new Point(px + 16, py), this.bushSprites[1]);
    this.scenery[y][x + 2] = new Mario.Prop(new Point(px + 32, py), this.bushSprites[1]);
    this.scenery[y][x + 3] = new Mario.Prop(new Point(px + 48, py), this.bushSprites[1]);
    this.scenery[y][x + 4] = new Mario.Prop(new Point(px + 64, py), this.bushSprites[2]);
  };

  putTwoBush(x: number, y: number) {
    let px = x * 16;
    let py = y * 16;
    this.scenery[y][x] = new Mario.Prop(new Point(px, py), this.bushSprites[0]);
    this.scenery[y][x + 1] = new Mario.Prop(new Point(px + 16, py), this.bushSprites[1]);
    this.scenery[y][x + 2] = new Mario.Prop(new Point(px + 32, py), this.bushSprites[1]);
    this.scenery[y][x + 3] = new Mario.Prop(new Point(px + 48, py), this.bushSprites[2]);
  };

  putSmallHill(x: number, y: number) {
    var px = x * 16, py = y * 16;
    this.scenery[y][x] = new Mario.Prop(new Point(px, py), this.hillSprites[0]);
    this.scenery[y][x + 1] = new Mario.Prop(new Point(px + 16, py), this.hillSprites[3]);
    this.scenery[y - 1][x + 1] = new Mario.Prop(new Point(px + 16, py - 16), this.hillSprites[1]);
    this.scenery[y][x + 2] = new Mario.Prop(new Point(px + 32, py), this.hillSprites[2]);
  };

  putTwoCloud(x: number, y: number) {
    let px = x * 16;
    let py = y * 16;
    this.scenery[y][x] = new Mario.Prop(new Point(px, py), this.cloudSprites[0]);
    this.scenery[y][x + 1] = new Mario.Prop(new Point(px + 16, py), this.cloudSprites[1]);
    this.scenery[y][x + 2] = new Mario.Prop(new Point(px + 32, py), this.cloudSprites[1]);
    this.scenery[y][x + 3] = new Mario.Prop(new Point(px + 48, py), this.cloudSprites[2]);
  };

  putThreeCloud(x: number, y: number) {
    let px = x * 16;
    let py = y * 16;
    this.scenery[y][x] = new Mario.Prop(new Point(px, py), this.cloudSprites[0]);
    this.scenery[y][x + 1] = new Mario.Prop(new Point(px + 16, py), this.cloudSprites[1]);
    this.scenery[y][x + 2] = new Mario.Prop(new Point(px + 32, py), this.cloudSprites[1]);
    this.scenery[y][x + 3] = new Mario.Prop(new Point(px + 48, py), this.cloudSprites[1]);
    this.scenery[y][x + 4] = new Mario.Prop(new Point(px + 64, py), this.cloudSprites[2]);
  };

  putRealPipe(x: number, y: number, length: number, direction: PipeDirection, destination: () => void) {
    let px = x * 16;
    let py = y * 16;
    this.pipes.push(new Mario.Pipe({
      pos: new Point(px, py),
      length: length,
      direction: direction,
      destination: destination
    }));
  }

  putFlagpole(x: number) {
    this.statics[12][x] = new Mario.Floor(new Point(16 * x, 192), this.wallSprite);
    for (let i = 3; i < 12; i++) {
      this.scenery[i][x] = new Mario.Prop(new Point(16 * x, 16 * i), this.flagpoleSprites[1])
    }
    this.scenery[2][x] = new Mario.Prop(new Point(16 * x, 32), this.flagpoleSprites[0]);
    this.items.push(new Mario.Flag(16 * x));
  }
}

Mario.Level = Level;
