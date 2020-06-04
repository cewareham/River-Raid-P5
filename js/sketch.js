"use strict";

let game;

function preload() {
	// CC object in constants.js
	CC.houseLeft = loadImage('assets/houseLeft.png');
	CC.houseRight = loadImage('assets/houseRight.png');
	CC.lvl01 = loadImage('assets/lvl001.png')
}

function setup() {
	CC.tileHeight = CC.lvl01.height;
	let canvas = createCanvas(800, 600);
	game = new Game(canvas);
}


function draw() {
	//background(0, 255, 0);
	game.update();
	game.render();
}

// center the canvas whenever the browser changes size
function windowResized() {
	game.centerCanvas();
}
