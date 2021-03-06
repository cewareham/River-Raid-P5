"use strict";

// Jet class
class Jet {
	constructor(xx, yy, dir, index, out, t_expl) {
		this.x = xx;
		this.y = yy;
		this.strDir = dir;
		this.dir = (this.strDir == "Left" ? -1 : 1);
		this.shape = CC["jet"+this.strDir];
		this.w = this.shape.width;
		this.h = this.shape.height;
		this.index = index;
		this.dHeight = height - CC.tileHeight;
		this.out = out;
		this.t_expl = t_expl;
		this.speed = 7;
	}

	// is jet y-coord on visible canvas?
	onScreen = () => {
		this.screenY = this.dHeight + this.y;
		return (this.screenY < height && this.screenY > -this.shape.height);
	}

	update = (dy) => {
		this.y += dy;
		if (this.onScreen()) {
			// move horizontally as soon as on-screen but not if exploding
			if (!this.t_expl) this.x += this.dir*this.speed;
			if (this.x > width) this.x = -this.w;
			else if (this.x < -this.w) this.x = width;
			if (CC.collide(game.shot,  this) && !this.out && game.shot.y >=0) {
				this.t_expl = 40;
				this.out = true;
				game.shot.y = -100;
				console.log("Shot collided with Jet");
			} else if (CC.collide(game.plane, this) && !this.out) {
				this.t_expl = 40;
				this.out = true;
				game.plane.losePlane();
				console.log("Plane collided with Jet");
			}
		}
	}

	render = () => {
		// this.screenY = this.dHeight + this.y;
		let img = this.shape;
		if (this.t_expl) {
			if (this.t_expl > 20) img = CC.expl1;
			else img = CC.expl2;
			this.t_expl--;
		}
		if (this.onScreen()) {                      // only draw if it's onscreen AND
			if (!this.out || this.t_expl)           // its not out or it is out and there's explosion animation to finish
				image(img, this.x, this.screenY);
		}
	}
}
