"use strict";

// House class
class House {
	constructor(xx, yy, ww, hh, shape) {
		this.xx = xx;
		this.yy = yy;
		this.ww = ww;
		this.hh = hh;
		this.shape = shape;
	}

	update = (dy) => {
		this.yy += dy;
	}

	render = () => {
		image(this.shape, this.xx, height - (game.bg.tileHeight - this.yy));
	}
}
