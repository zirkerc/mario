class Player extends Entity {
    power;
    coins;
    powering;
    bounce;
    jumping;
    canJump;
    invincibility;
    crouching;
    fireballs;
    runheld;
    noInput;
    targetPos;
    maxSpeed;
    shooting;
    moveAcc;
    dying;
    starTime;
    flagging;
    powerSprites;
    powerSizes;
    shift;
    touchedItem;
    waiting;
    piping;
    pipeLoc;
    exiting;
    constructor(pos) {
        super({
            pos: pos,
            sprite: new Mario.Sprite('sprites/player.png', new Point(80, 32), [16, 16], 0),
            hitbox: new BoundBox(0, 0, 16, 16)
        });
        //I know, I know, there are a lot of variables tracking Mario's state.
        //Maybe these can be consolidated some way? We'll see once they're all in.
        this.power = 0;
        this.coins = 0;
        this.powering = [];
        this.bounce = false;
        this.jumping = 0;
        this.canJump = true;
        this.invincibility = 0;
        this.crouching = false;
        this.fireballs = 0;
        this.runheld = false;
        this.noInput = false;
        this.targetPos = new Point();
    }
    ;
    run() {
        this.maxSpeed = 2.5;
        if (this.power == 2 && !this.runheld) {
            this.shoot();
        }
        this.runheld = true;
    }
    shoot() {
        if (this.fireballs >= 2)
            return; //Projectile limit!
        this.fireballs += 1;
        var fb = new Mario.Fireball(new Point(this.pos.x + 8, this.pos.y)); //I hate you, Javascript.
        fb.spawn(this.left);
        this.shooting = 2;
    }
    // left(left: any) {
    // 	throw new Error("Method not implemented.");
    // }
    noRun() {
        this.maxSpeed = 1.5;
        this.moveAcc = 0.07;
        this.runheld = false;
    }
    moveRight() {
        //we're on the ground
        if (this.vel.y === 0 && this.standing) {
            if (this.crouching) {
                this.noWalk();
                return;
            }
            this.acc.x = this.moveAcc;
            this.left = false;
        }
        else {
            this.acc.x = this.moveAcc;
        }
    }
    ;
    moveLeft() {
        if (this.vel.y === 0 && this.standing) {
            if (this.crouching) {
                this.noWalk();
                return;
            }
            this.acc.x = -this.moveAcc;
            this.left = true;
        }
        else {
            this.acc.x = -this.moveAcc;
        }
    }
    ;
    noWalk() {
        this.maxSpeed = 0;
        if (this.vel.x === 0)
            return;
        if (Math.abs(this.vel.x) <= 0.1) {
            this.vel.x = 0;
            this.acc.x = 0;
        }
    }
    ;
    crouch() {
        if (this.power === 0) {
            this.crouching = false;
            return;
        }
        if (this.standing)
            this.crouching = true;
    }
    noCrouch() {
        this.crouching = false;
    }
    jump() {
        if (this.vel.y > 0) {
            return;
        }
        if (this.jumping) {
            this.jumping -= 1;
        }
        else if (this.standing && this.canJump) {
            this.jumping = 20;
            this.canJump = false;
            this.standing = false;
            this.vel.y = -6;
            if (this.power === 0) {
                sounds.smallJump.currentTime = 0;
                sounds.smallJump.play();
            }
            else {
                sounds.bigJump.currentTime = 0;
                sounds.bigJump.play();
            }
        }
    }
    ;
    noJump() {
        this.canJump = true;
        if (this.jumping) {
            if (this.jumping <= 16) {
                this.vel.y = 0;
                this.jumping = 0;
            }
            else
                this.jumping -= 1;
        }
    }
    ;
    setAnimation() {
        if (this.dying)
            return;
        if (this.starTime) {
            var index;
            if (this.starTime > 60)
                index = Math.floor(this.starTime / 2) % 3;
            else
                index = Math.floor(this.starTime / 8) % 3;
            this.sprite.pos.y = level.invincibility[index];
            if (this.power == 0) {
                this.sprite.pos.y += 32;
            }
            this.starTime -= 1;
            if (this.starTime == 0) {
                switch (this.power) {
                    case 0:
                        this.sprite.pos.y = 32;
                        break;
                    case 1:
                        this.sprite.pos.y = 0;
                        break;
                    case 2:
                        this.sprite.pos.y = 96;
                        break;
                }
            }
        }
        //okay cool, now set the sprite
        if (this.crouching) {
            this.sprite.pos.x = 176;
            this.sprite.speed = 0;
            return;
        }
        if (this.jumping) {
            this.sprite.pos.x = 160;
            this.sprite.speed = 0;
        }
        else if (this.standing) {
            if (Math.abs(this.vel.x) > 0) {
                if (this.vel.x * this.acc.x >= 0) {
                    this.sprite.pos.x = 96;
                    this.sprite.frames = [0, 1, 2];
                    if (this.vel.x < 0.2) {
                        this.sprite.speed = 5;
                    }
                    else {
                        this.sprite.speed = Math.abs(this.vel.x) * 8;
                    }
                }
                else if ((this.vel.x > 0 && this.left) || (this.vel.x < 0 && !this.left)) {
                    this.sprite.pos.x = 144;
                    this.sprite.speed = 0;
                }
            }
            else {
                this.sprite.pos.x = 80;
                this.sprite.speed = 0;
            }
            if (this.shooting) {
                this.sprite.pos.x += 160;
                this.shooting -= 1;
            }
        }
        if (this.flagging) {
            this.sprite.pos.x = 192;
            this.sprite.frames = [0, 1];
            this.sprite.speed = 10;
            if (this.vel.y === 0)
                this.sprite.frames = [0];
        }
        //which way are we facing?
        if (this.left) {
            this.sprite.img = 'sprites/playerl.png';
        }
        else {
            this.sprite.img = 'sprites/player.png';
        }
    }
    ;
    update(dt, vX) {
        if (this.powering.length !== 0) {
            var next = this.powering.shift();
            if (next == 5)
                return;
            this.sprite.pos = this.powerSprites[next];
            this.sprite.size = this.powerSizes[next];
            this.pos.y += this.shift[next];
            if (this.powering.length === 0) {
                delete level.items[this.touchedItem];
            }
            return;
        }
        if (this.invincibility) {
            this.invincibility -= Math.round(dt * 60);
        }
        if (this.waiting) {
            this.waiting -= dt;
            if (this.waiting <= 0) {
                this.waiting = 0;
            }
            else
                return;
        }
        if (this.bounce) {
            this.bounce = false;
            this.standing = false;
            this.vel.y = -3;
        }
        if (this.pos.x <= vX) {
            this.pos.x = vX;
            this.vel.x = Math.max(this.vel.x, 0);
        }
        if (Math.abs(this.vel.x) > this.maxSpeed) {
            this.vel.x -= 0.05 * this.vel.x / Math.abs(this.vel.x);
            this.acc.x = 0;
        }
        if (this.dying) {
            if (this.pos.y < this.targetPos.y) {
                this.vel.y = 1;
            }
            this.dying -= 1 * dt;
            if (this.dying <= 0) {
                player = new Mario.Player(level.playerPos);
                level.loader.call(undefined);
                input.reset();
            }
        }
        else {
            this.acc.y = 0.25;
            if (this.pos.y > 240) {
                this.die();
            }
        }
        if (this.piping) {
            this.acc = new Point(0, 0);
            var pos = new Point(Math.round(this.pos.x), Math.round(this.pos.y));
            if (pos.x === this.targetPos.x && pos.y === this.targetPos.y) {
                this.piping = false;
                this.pipeLoc.call(undefined);
            }
        }
        if (this.flagging) {
            this.acc = new Point(0, 0);
        }
        if (this.exiting) {
            this.left = false;
            this.flagging = false;
            this.vel.x = 1.5;
            if (this.pos.x >= this.targetPos.x) {
                this.sprite.size = [0, 0];
                this.vel = new Point(0, 0);
                window.setTimeout(function () {
                    player.sprite.size = player.power === 0 ? [16, 16] : [16, 32];
                    player.exiting = false;
                    player.noInput = false;
                    level.loader();
                    if (player.power !== 0)
                        player.pos.y -= 16;
                    music.overworld.currentTime = 0;
                }, 5000);
            }
        }
        //approximate acceleration
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.setAnimation();
        this.sprite.update(dt);
    }
    ;
    checkCollisions() {
        if (this.piping || this.dying)
            return;
        //x-axis first!
        var h = this.power > 0 ? 2 : 1;
        var w = 1;
        if (this.pos.y % 16 !== 0) {
            h += 1;
        }
        if (this.pos.x % 16 !== 0) {
            w += 1;
        }
        var baseX = Math.floor(this.pos.x / 16);
        var baseY = Math.floor(this.pos.y / 16);
        for (var i = 0; i < h; i++) {
            if (baseY + i < 0 || baseY + i >= 15)
                continue;
            for (var j = 0; j < w; j++) {
                if (baseY < 0) {
                    i++;
                }
                if (level.statics[baseY + i][baseX + j]) {
                    level.statics[baseY + i][baseX + j].isCollideWith(this);
                }
                if (level.blocks[baseY + i][baseX + j]) {
                    level.blocks[baseY + i][baseX + j].isCollideWith(this);
                }
            }
        }
    }
    ;
    powerUp(idx) {
        sounds.powerup.play();
        this.powering = [0, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 3, 5, 1, 5, 2, 5, 3, 5, 1, 5, 4];
        this.touchedItem = idx;
        if (this.power === 0) {
            this.sprite.pos.x = 80;
            var newy = this.sprite.pos.y - 32;
            this.powerSprites = [new Point(80, newy + 32), new Point(80, newy + 32), new Point(320, newy), new Point(80, newy), new Point(128, newy)];
            this.powerSizes = [[16, 16], [16, 16], [16, 32], [16, 32], [16, 32]];
            this.shift = [0, 16, -16, 0, -16];
            this.power = 1;
            this.hitbox = new BoundBox(0, 0, 16, 32);
        }
        else if (this.power == 1) {
            var curx = this.sprite.pos.x;
            this.powerSprites = [new Point(curx, 96), new Point(curx, level.invincibility[0]),
                new Point(curx, level.invincibility[1]), new Point(curx, level.invincibility[2]),
                new Point(curx, 96)];
            this.powerSizes = [[16, 32], [16, 32], [16, 32], [16, 32], [16, 32]];
            this.shift = [0, 0, 0, 0, 0];
            this.power = 2;
        }
        else {
            this.powering = [];
            delete level.items[idx];
            //no animation, but we play the sound and you get 5000 points.
        }
    }
    ;
    damage() {
        if (this.power === 0) { //if you're already small, you dead!
            this.die();
        }
        else { //otherwise, you get turned into small mario
            sounds.pipe.play();
            this.powering = [0, 5, 1, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 1, 5, 2, 5, 3];
            this.shift = [0, 16, -16, 16];
            this.sprite.pos = new Point(160, 0);
            this.powerSprites = [new Point(160, 0), new Point(240, 32), new Point(240, 0), new Point(160, 32)];
            this.powerSizes = [[16, 32], [16, 16], [16, 32], [16, 16]];
            this.invincibility = 120;
            this.power = 0;
            this.hitbox = new BoundBox(0, 0, 16, 16);
        }
    }
    ;
    die() {
        //TODO: rewrite the way sounds work to emulate the channels of an NES.
        music.overworld.pause();
        music.underground.pause();
        music.overworld.currentTime = 0;
        music.death.play();
        this.noWalk();
        this.noRun();
        this.noJump();
        this.acc.x = 0;
        this.sprite.pos = new Point(176, 32);
        this.sprite.speed = 0;
        this.power = 0;
        this.waiting = 0.5;
        this.dying = 2;
        if (this.pos.y < 240) { //falling into a pit doesn't do the animation.
            this.targetPos = new Point(this.pos.x, this.pos.y - 128);
            this.vel = new Point(0, -5);
        }
        else {
            this.vel = new Point(0, 0);
            this.targetPos = new Point(this.pos.x, this.pos.y - 16);
        }
    }
    ;
    star(idx) {
        delete level.items[idx];
        this.starTime = 660;
    }
    pipe(direction, destination) {
        sounds.pipe.play();
        this.piping = true;
        this.pipeLoc = destination;
        switch (direction) {
            case "LEFT":
                this.vel = new Point(-1, 0);
                this.targetPos = new Point(Math.round(this.pos.x - 16), Math.round(this.pos.y));
                break;
            case "RIGHT":
                this.vel = new Point(1, 0);
                this.targetPos = new Point(Math.round(this.pos.x + 16), Math.round(this.pos.y));
                break;
            case "DOWN":
                this.vel = new Point(0, 1);
                this.targetPos = new Point(Math.round(this.pos.x), Math.round(this.pos.y + this.hitbox.height));
                break;
            case "UP":
                this.vel = new Point(0, -1);
                this.targetPos = new Point(Math.round(this.pos.x), Math.round(this.pos.y - this.hitbox.height));
                break;
        }
    }
    flag() {
        this.noInput = true;
        this.flagging = true;
        this.vel = new Point(0, 2);
        this.acc = new Point(0, 0);
    }
    exit() {
        this.pos.x += 16;
        this.targetPos.x = level.exit * 16;
        this.left = true;
        this.setAnimation();
        this.waiting = 1;
        this.exiting = true;
    }
}
Mario.Player = Player;
