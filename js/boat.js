"use strict";

// Boat class
class Boat {
	constructor(xx, yy, ww, hh, shape, index) {
		this.x = xx;
		this.y = yy;
		this.w = ww;
		this.h = hh;
		this.shape = shape;
		this.index = index;
		this.dHeight = height - CC.tileHeight;
	}

	// is boat y-coord on visible canvas?
	onScreen = () => {
		this.screenY = this.dHeight + this.y;
		return (this.screenY < height && this.screenY > -this.shape.height);
	}

	update = (dy) => {
		this.y += dy;
	}

	render = () => {
		// this.screenY = this.dHeight + this.y;
		if (this.onScreen())
			image(this.shape, this.x, this.screenY);
	}
}
