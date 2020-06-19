"use strict";

// Fuel class
class Fuel {
	constructor(xx, yy, ww, hh, shape, index) {
		this.xx = xx;
		this.yy = yy;
		this.ww = ww;
		this.hh = hh;
		this.shape = shape;
		this.index = index;
		this.dHeight = height - CC.tileHeight;
	}

	// is house y-coord on visible canvas?
	onScreen = () => {
		this.screenY = this.dHeight + this.yy;
		return (this.screenY < height && this.screenY > -this.shape.height);
	}

	update = (dy) => {
		this.yy += dy;
	}

	render = () => {
		// this.screenY = this.dHeight + this.yy;
		if (this.onScreen())
			image(this.shape, this.xx, this.screenY);
	}
}
