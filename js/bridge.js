"use strict";

// Bridge class
class Bridge {
	constructor(xx, yy, ww, hh, shape, index) {
		this.xx = xx;
		this.yy = yy;
		this.ww = ww;
		this.hh = hh;
        this.shape = shape;
        this.index = index;
        this.dHeight = height - CC.tileHeight;
        this.firstTime = true;
    }

    // is bridge y-coord (screenCoord) on visible canvas?
	onScreen = () => {
		this.screenCoord = this.dHeight + this.yy;
		return (this.screenCoord < height && this.screenCoord > -this.shape.height);
	}

	update = (dy) => {
        this.yy += dy;
	}

	render = () => {
        // this.screenCoord = this.dHeight + this.yy;
        // draw all bridges except 1st one
        if (this.index == 0 && this.firstTime) {
            if (this.yy > CC.tileHeight) {
                this.firstTime = false;
            }
        } else if (this.onScreen()) {
            image(this.shape, this.xx, this.screenCoord);
        }
	}
}
