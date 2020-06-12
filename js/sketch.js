"use strict";

let game;

function preload() {
	// CC object in constants.js
	CC.houseLeft = loadImage('assets/houseLeft.png');
	CC.houseRight = loadImage('assets/houseRight.png');
	CC.lvl01 = loadImage('assets/lvl001.png');
	CC.bridge = loadImage('assets/bridge.png');
	CC.bridgeEx1 = loadImage('assets/bridgeEx1.png');
	CC.bridgeEx2 = loadImage('assets/bridgeEx2.png');
}

function setup() {
	// console.log(typeof CC.houseLeft);							// result -> 'object'
	// console.log(CC.houseLeft instanceof HTMLCanvasElement);		// result -> false
	// console.log(CC.houseLeft instanceof HTMLImageElement);		// result -> false
	// console.log(CC.houseLeft);
	// console.log('pixels' in CC.houseLeft);	// result -> true p5.js loadImage(..) returns a P5.Image object that has pixels field

	CC.tileHeight = CC.lvl01.height;		// all map images should be same height
	let canvas = createCanvas(800, 600);
	game = new Game(canvas);
}


function draw() {
	//background(0, 255, 0);
	game.update();
	game.render();
}

// check canvas pixel color when mouse pressed
function mousePressed() {
	let pixelData,
		mX = mouseX,
		mY = mouseY;

	let pixelD1 = get(mX, mY);
	let pixelD2 = drawingContext.getImageData(mX, mY, 1, 1).data;
	pixelData = pixelD1;
	let pixelHex = '#' + CC.rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
	document.getElementById('status').innerHTML = "(" + mX + "," + mY + ")->" + pixelData + "->" + pixelHex;
}

// center the canvas whenever the browser changes size
function windowResized() {
	game.centerCanvas();
}
