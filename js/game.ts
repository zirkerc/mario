var requestAnimFrame = (function () {

  return window.requestAnimationFrame ||
    //@ts-ignore
    window["webkitRequestAnimationFrame"] ||
    //@ts-ignore
    window["mozRequestAnimationFrame"] ||
    //@ts-ignore
    window["oRequestAnimationFrame"] ||
    //@ts-ignore
    window["msRequestAnimationFrame"] ||
    function (callback: TimerHandler) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

//create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
var updateables: ({ update: (dt: number, gameTime: number) => void })[] = [];
var fireballs: Fireball[] = [];
var player = new Mario.Player(new Point(0, 0));

//we might have to get the size and calculate the scaling
//but this method should let us make it however big.
//Cool!
//TODO: Automatically scale the game to work and look good on widescreen.
//TODO: fiddling with scaled sprites looks BETTER, but not perfect. Hmm.
canvas.width = 762;
canvas.height = 720;
ctx.scale(3, 3);
document.body.appendChild(canvas);

//viewport
var vX = 0,
  vY = 0,
  vWidth = 256,
  vHeight = 240;

//load our images
resources.load([
  'sprites/player.png',
  'sprites/enemy.png',
  'sprites/tiles.png',
  'sprites/playerl.png',
  'sprites/items.png',
  'sprites/enemyr.png',
  "sprites/1-2.png"
]);

resources.onReady(init);

var level: Level;
var sounds: Sounds;
var music: Music;

//initialize
var lastTime: number;
function init() {
  music = {
    overworld: new Audio('sounds/aboveground_bgm.ogg'),
    underground: new Audio('sounds/underground_bgm.ogg'),
    clear: new Audio('sounds/stage_clear.wav'),
    death: new Audio('sounds/mariodie.wav')
  };
  sounds = {
    smallJump: new Audio('sounds/jump-small.wav'),
    bigJump: new Audio('sounds/jump-super.wav'),
    breakBlock: new Audio('sounds/breakblock.wav'),
    bump: new Audio('sounds/bump.wav'),
    coin: new Audio('sounds/coin.wav'),
    fireball: new Audio('sounds/fireball.wav'),
    flagpole: new Audio('sounds/flagpole.wav'),
    kick: new Audio('sounds/kick.wav'),
    pipe: new Audio('sounds/pipe.wav'),
    itemAppear: new Audio('sounds/itemAppear.wav'),
    powerup: new Audio('sounds/powerup.wav'),
    stomp: new Audio('sounds/stomp.wav')
  };

  Mario.levels["1-1"] = oneone;
  Mario.levels["1-1.tunnel"] = oneonetunnel;

  let cW = canvas.width;
  let cH = canvas.height;

  // function getImageData(resource: string) {
  //   let png = resources.get(resource);
  //   canvas.width = png.width;
  //   canvas.height = png.height;
  //   ctx.scale(1, 1);

  //   ctx.drawImage(png, 0, 0);
  //   let data = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //   canvas.width = cW;
  //   canvas.height = cH;
  //   ctx.scale(3, 3);
  //   return data;
  // }

  //let pixels = getImageData("sprites/tiles.png");
  //console.log(pixels);
  Mario.loadLevel = (level) => {
    Mario.levels[level]();
  };
  //Mario.oneone();
  Mario.loadLevel("1-1");
  lastTime = Date.now();
  main();
}

var gameTime = 0;

//set up the game loop
function main() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  update(dt);
  render();

  lastTime = now;
  requestAnimFrame(main);
}

/**
 * Game Loop Update
 * @param {number} dt 
 */
function update(dt: number) {
  gameTime += dt;

  // Update Input
  handleInput(dt);

  // Update Entitiels
  updateEntities(dt, gameTime);

  // Check for object collision
  checkCollisions();
}

/**
 * Checks the input object for events.
 * @param {number} dt 
 * @returns 
 */
function handleInput(dt: number) {
  // Poll input.  Used for gamepad events
  input.update();

  // Exit if the player can't take input
  if (player.piping || player.dying || player.noInput) return; //don't accept input

  // Check for run input
  if (input.isDown('RUN')) {
    player.run();
  } else {
    player.noRun();
  }

  // Check for jump input
  if (input.isDown('JUMP')) {
    player.jump();
  } else {
    //we need this to handle the timing for how long you hold it
    player.noJump();
  }

  // Check for crouch input
  if (input.isDown('DOWN')) {
    player.crouch();
  } else {
    player.noCrouch();
  }

  // Check for movement input
  if (input.isDown('LEFT')) {
    player.moveLeft();
  }
  else if (input.isDown('RIGHT')) {
    player.moveRight();
  } else {
    player.noWalk();
  }
}


/**
 * update all the moving stuff
 * @param {number} dt 
 * @param {number} gameTime 
 * @returns 
 */
function updateEntities(dt: number, gameTime: number) {
  player.update(dt, vX);
  updateables.forEach(function (ent) {
    ent.update(dt, gameTime);
  });

  //This should stop the jump when he switches sides on the flag.
  if (player.exiting) {
    if (player.pos.x > vX + 96)
      vX = player.pos.x - 96
  } else if (level.scrolling && player.pos.x > vX + 80) {
    vX = player.pos.x - 80;
  }

  if (player.powering.length !== 0 || player.dying) { return; }
  level.items.forEach(function (ent) {
    ent.update(dt);
  });

  level.enemies.forEach(function (ent) {
    ent.update(dt, vX);
  });

  fireballs.forEach(function (fireball) {
    fireball.update(dt);
  });
  level.pipes.forEach(function (pipe) {
    pipe.update(dt);
  });
}

//scan for collisions
function checkCollisions() {
  if (player.powering.length !== 0 || player.dying) { return; }
  player.checkCollisions();

  //Apparently for each will just skip indices where things were deleted.
  level.items.forEach(function (item) {
    item.checkCollisions();
  });
  level.enemies.forEach(function (ent) {
    ent.checkCollisions();
  });
  fireballs.forEach(function (fireball) {
    fireball.checkCollisions();
  });
  level.pipes.forEach(function (pipe) {
    pipe.checkCollisions();
  });
}

//draw the game!
function render() {
  updateables = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = level.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //scenery gets drawn first to get layering right.
  for (var i = 0; i < 15; i++) {
    for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 20; j++) {
      if (level.scenery[i][j]) {
        renderEntity(level.scenery[i][j]);
      }
    }
  }

  //then items
  level.items.forEach(function (item) {
    renderEntity(item);
  });

  level.enemies.forEach(function (enemy) {
    renderEntity(enemy);
  });



  fireballs.forEach(function (fireball) {
    renderEntity(fireball);
  })

  //then we draw every static object.
  for (var i = 0; i < 15; i++) {
    for (var j = Math.floor(vX / 16) - 1; j < Math.floor(vX / 16) + 20; j++) {
      if (level.statics[i][j]) {
        renderEntity(level.statics[i][j]);
      }
      if (level.blocks[i][j]) {
        renderEntity(level.blocks[i][j]);
        updateables.push(level.blocks[i][j]);
      }
    }
  }

  //then the player
  if (player.invincibility % 2 === 0) {
    renderEntity(player);
  }

  //Mario goes INTO pipes, so naturally they go after.
  level.pipes.forEach(function (pipe) {
    renderEntity(pipe);
  });
}

function renderEntity(entity: Renderable) {
  entity.render(ctx, vX, vY);
}
