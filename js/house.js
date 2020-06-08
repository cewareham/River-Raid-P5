"use strict";

// House class
class House {
	constructor(xx, yy, ww, hh, shape, index) {
		this.xx = xx;
		this.yy = yy;
		this.ww = ww;
		this.hh = hh;
		this.shape = shape;
		this.index = index;
		this.dHeight = height - CC.tileHeight;
	}

	// is house y-coord (screenCoord) on visible canvas?
	onScreen = () => {
		this.screenCoord = this.dHeight + this.yy;
		return (this.screenCoord < height && this.screenCoord > -this.shape.height);
	}

	update = (dy) => {
		this.yy += dy;
	}

	render = () => {
		// this.screenCoord = this.dHeight + this.yy;
		if (this.onScreen())
			image(this.shape, this.xx, this.screenCoord);
	}
}
