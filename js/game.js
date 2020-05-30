"use strict";

// Game class
class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.centerCanvas();
		this.bg = new Background(['assets/lvl002.png', 'assets/lvl001.png'], false);
		this.makeHouses();      // make houses with trees
		this.scrollSpeed = 5;
	}
  
	makeHouses = () => {
		this.houses = [];
		let hd = CC.houseData;
		for (let ii=0; ii<hd.length; ii++) {
			let obj = hd[ii];
			let xx = obj.x;
			let yy = obj.y;
			let img = (obj.img == "left" ? CC.houseLeft : CC.houseRight);
			this.houses.push(new House(xx, yy, img.width, img.height, img));
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
