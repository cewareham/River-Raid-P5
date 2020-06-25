"use strict";

let game;

function preload() {
	// CC object in constants.js
	CC.houseLeft = loadImage('assets/houseLeft.png');
	CC.houseRight = loadImage('assets/houseRight.png');
	CC.map001 = loadImage('assets/map001.png');
	CC.bridge = loadImage('assets/bridge.png');
	CC.bridgeEx1 = loadImage('assets/bridgeEx1.png');
	CC.bridgeEx2 = loadImage('assets/bridgeEx2.png');
	CC.expl1 = loadImage('assets/expl1.png');
	CC.expl2 = loadImage('assets/expl2.png');
	CC.expl3 = loadImage('assets/expl3.png');
	CC.fuel = loadImage('assets/fuel.png');
	CC.boatLeft = loadImage('assets/boatLeft.png');
	CC.boatRight = loadImage('assets/boatRight.png');
	CC.heliLeft1 = loadImage('assets/heliLeft1.png');
	CC.heliLeft2 = loadImage('assets/heliLeft2.png');
	CC.heliRight1 = loadImage('assets/heliRight1.png');
	CC.heliRight2 = loadImage('assets/heliRight2.png');
}

function setup() {
	// console.log(typeof CC.houseLeft);							// result -> 'object'
	// console.log(CC.houseLeft instanceof HTMLCanvasElement);		// result -> false
	// console.log(CC.houseLeft instanceof HTMLImageElement);		// result -> false
	// console.log(CC.houseLeft);
	// console.log('pixels' in CC.houseLeft);	// result -> true p5.js loadImage(..) returns a P5.Image object that has pixels field

	CC.tileHeight = CC.map001.height;		// all map images should be same height
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
