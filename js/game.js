"use strict";

// Game class
class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.centerCanvas();
		this.bg = new Background(['assets/lvl002.png', 'assets/lvl001.png'], false);
		this.houses= [];
		this.level = 0;
		this.makeHouses(this.level, this.level+1);	// make level 1 houses/trees
		this.scrollSpeed = 5;
		this.housesMade = false;
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
			let yy = obj.y
			if (offset) yy -= offset*CC.tileHeight;
			let img = (obj.img == "L" ? CC.houseLeft : CC.houseRight);
			this.houses.push(new House(xx, yy, img.width, img.height, img, ii));
		}
	}

	update() {
		this.bg.update();
	}

	renderHouses = (dy) => {
		for (let ii=0; ii<this.houses.length; ii++) {
			this.houses[ii].update(dy);
			this.houses[ii].render();
		}
	}
  
	render() {
		if (keyIsDown(DOWN_ARROW)) {
			this.bg.render(-this.scrollSpeed);
			this.renderHouses(-this.scrollSpeed);
		}
		else if (keyIsDown(UP_ARROW)) {
			this.bg.render(this.scrollSpeed);
			this.renderHouses(this.scrollSpeed);
		}
		else this.renderHouses(0);
	}

	centerCanvas() {
		var xx = (windowWidth - width) / 2;
		var yy = (windowHeight - height) / 2;
		this.canvas.position(xx, yy);
	}
}
