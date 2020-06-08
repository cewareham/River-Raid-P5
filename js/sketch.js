"use strict";

let game;

function preload() {
	// CC object in constants.js
	CC.houseLeft = loadImage('assets/houseLeft.png');
	CC.houseRight = loadImage('assets/houseRight.png');
	CC.lvl01 = loadImage('assets/lvl001.png');
	CC.bridge = loadImage('assets/bridge.png');
}

function setup() {
	// console.log(typeof CC.houseLeft);							// result -> 'object'
	// console.log(CC.houseLeft instanceof HTMLCanvasElement);		// result -> false
	// console.log(CC.houseLeft instanceof HTMLImageElement);		// result -> false
	// console.log(CC.houseLeft);
	// console.log('pixels' in CC.houseLeft);	// result -> true p5.js loadImage(..) returns a P5.Image object that has pixels field

	CC.tileHeight = CC.lvl01.height;		// all images should be same height
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
