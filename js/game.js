"use strict";

// Game class
class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.centerCanvas();
		this.bg = new Background(['assets/lvl002.png', 'assets/lvl001.png'], false);
		this.houses= [];
		this.bridges = [];
		this.level = 0;
		let planeWidth = 49,
			planeHeight = 42,
			planeX = Math.round(CC.bridgeData.x + CC.bridge.width/2 - planeWidth/2),
			planeY = height - 60;
		//                      x         y     width            height  shape#        out expl
		this.plane = new Plane(planeX, planeY, planeWidth, planeHeight, CC.eShape.PLANE, 0, 0);
		this.makeHouses(this.level, this.level+1);	// make level 1 houses/trees
		this.makeBridges(0, 1);	// make level 1 bridges
		this.scrollSpeed = this.bg.scrollSpeed;
	}

	makeBridges = (offset1, offset2) => {
		this.bridges = [];
		this.newBridge(offset1);
		this.newBridge(offset2);
	}

	newBridge = (offset) => {
		let bd = CC.bridgeData;
		let xx = bd.x;
		let yy = bd.y;
		if (offset) yy -= offset*CC.tileHeight;
		let img = CC.bridge;
		this.bridges.push(new Bridge(xx, yy, img.width, img.height, img, offset, 0, 0));
	}

	replaceHouses = (idx) => {
		this.houses.splice(0, CC.houseData[idx-2].length)	// keep previous house data
		this.newHouses(idx, 1);								// add new house data
	}

	makeHouses = (idx1, idx2) => {
		this.houses = [];
		this.newHouses(idx1, 0);		// make level 1 houses/trees
		this.newHouses(idx2, 1);		// make level 2 houses/trees
	}
  
	newHouses = (idx, offset) => {
		let hd = CC.houseData[idx];
		for (let ii=0; ii<hd.length; ii++) {
			let obj = hd[ii];
			let xx = obj.x;
			let yy = obj.y;
			if (offset) yy -= offset*CC.tileHeight;
			let img = (obj.img == "L" ? CC.houseLeft : CC.houseRight);
			this.houses.push(new House(xx, yy, img.width, img.height, img, ii));
		}
	}

	renderBridges = (dy) => {
		for (let ii=0; ii<this.bridges.length; ii++) {
			this.bridges[ii].update(dy);
			this.bridges[ii].render();
		}
	}

	renderHouses = (dy) => {
		for (let ii=0; ii<this.houses.length; ii++) {
			this.houses[ii].update(dy);
			this.houses[ii].render();
		}
	}

	update() {
		this.bg.update();
		this.plane.update();
	}
  
	render() {
		let speed = 0;
		if (keyIsDown(DOWN_ARROW)) {
			speed = -this.scrollSpeed;
		}
		else if (keyIsDown(UP_ARROW)) {
			speed = this.scrollSpeed;
		}

		this.bg.render(speed);
		this.renderHouses(speed);
		this.renderBridges(speed);
		this.plane.render();
	}

	centerCanvas() {
		var xx = (windowWidth - width) / 2;
		var yy = (windowHeight - height) / 2;
		this.canvas.position(xx, yy);
	}
}
