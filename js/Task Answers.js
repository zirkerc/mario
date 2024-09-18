
// Add some bricks.
for (let i = 0; i < 10; i++) {
	level.putBrick(5 + i, 12 - i, null);
}



// Us a for loop with if
for (let i = 0; i < 11; i++) {
	if (i < 6) {
		level.putBrick(5 + i, 12 - i, null);
	} else {
		level.putBrick(5 + i, 2 + i, null);
	}
}


// Wall of questions
for (let row = 0; row < 5; row++) {
	for (let col = 0; col < 5; col++) {
		level.putQBlock(5 + col, 12 - row, null);
	}
}

// Stairs of questions
for (let row = 0; row < 5; row++) {
	for (let col = row; col < 5; col++) {
		level.putQBlock(5 + col, 12 - row, null);
	}
}


// Stairs that alternate ? and block
for (let row = 0; row < 5; row++) {
	for (let col = row; col < 5; col++) {
		if (col % 2 === 0) {
			level.putBrick(5 + col, 12 - row, null);
		} else {
			level.putQBlock(5 + col, 12 - row, null);
		}
	}
}

// Stairs Special
for (let row = 0; row < 5; row++) {
	for (let col = row; col < 5; col++) {
		if (row % 2 === 0) {
			if (col % 2 === 0) {
				level.putBrick(5 + col, 12 - row, null);
			} else {
				level.putQBlock(5 + col, 12 - row, null);
			}
		} else {
			if (col % 2 !== 0) {
				level.putBrick(5 + col, 12 - row, null);
			} else {
				level.putQBlock(5 + col, 12 - row, null);
			}
		}
	}
}

// Add a Goomba
level.putGoomba(13, 4);


// Spawner 

// Goomba Spawner
clearInterval(window.goombaSpawner);
let count = 0;
window.goombaSpawner = setInterval(() => {
	count++;
	if (count % 3 == 0) {
		level.putGoomba((player.pos.x / 16) + 8, Math.max(0, (player.pos.y / 16) - 1));
	} else {
		level.putKoopa((player.pos.x / 16) + 8, Math.max(0, (player.pos.y / 16) - 1))
	}
}, 5000);






player.powerUp(-1);
