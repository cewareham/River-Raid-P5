"use strict";

// Fuel class
class Fuel {
	constructor(xx, yy, ww, hh, shape, index, out, t_expl) {
		this.x = xx;
		this.y = yy;
		this.w = ww;
		this.h = hh;
		this.shape = shape;
		this.index = index;
		this.out = out;
		this.t_expl = t_expl;
		this.dHeight = height - CC.tileHeight;
	}

    collide = (obj) => {
        if (this.onScreen()) {
            return CC.collide(obj, this);
        }
        return false;
    }

	// is house y-coord on visible canvas?
	onScreen = () => {
		this.screenY = this.dHeight + this.y;
		return (this.screenY < height && this.screenY > -this.shape.height);
	}

	update = (dy) => {
		this.y += dy;
		if (!this.out && this.collide(game.plane)) {
			console.log("Plane collided with Fuel");
			game.fuel_level += 0.4;
			if (game.fuel_level > game.maxFuel) game.fuel_level = game.maxFuel;
		}
		
		if (this.collide(game.shot) && !this.out && game.shot.y >=0) {
			this.t_expl = 60;
			this.out = true;
			game.shot.y = -100;
			console.log("Shot collided with Fuel");
		}
}

	render = () => {
		// this.screenY = this.dHeight + this.y;
		let img = this.shape;
		if (this.t_expl) {
			if (this.t_expl > 40) img = CC.expl1;
			else if (this.t_expl > 20) img = CC.expl2;
			else img = CC.expl3;
			this.t_expl--;
			if (this.t_expl == 0) this.out = false;
		}
		if (this.onScreen())
			image(img, this.x, this.screenY);
	}
}
