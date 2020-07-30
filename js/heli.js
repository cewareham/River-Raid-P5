"use strict";

// Helicopter class
class Heli {
	constructor(xx, yy, dir, shapeNum, index, out, t_expl) {
		this.x = xx;
		this.y = yy;
		this.strDir = dir;
		this.dir = (this.strDir == "Left" ? -1 : 1);
		this.shapeNum = shapeNum-1;
		this.shape = CC["heli"+this.strDir+(shapeNum+1)];
		this.w = this.shape.width;
		this.h = this.shape.height;
		this.index = index;
		this.dHeight = height - CC.tileHeight;
		this.frame = 0;
		this.propeller = 0;
		this.out = out;
		this.t_expl = t_expl;
		this.speed = 5;
	}

	// is heli y-coord on visible canvas?
	onScreen = () => {
		this.screenY = this.dHeight + this.y;
		return (this.screenY < height && this.screenY > -this.shape.height);
	}

	update = (dy) => {
		this.y += dy;
		if (this.onScreen()) {
			this.frame++;
			if (this.frame % 4 == 0) this.propeller = !this.propeller;
			if (this.propeller) {	// animate heli propeller
				this.shapeNum = !this.shapeNum;
				this.shape = CC["heli"+this.strDir+(this.shapeNum+1)];
			}
			// only move horizontally if plane is close & heli is not exploding
			if (this.screenY > game.plane.y-220 && !this.t_expl) this.x += this.dir*this.speed;
			let tempY = this.y;
			this.y = this.screenY;
			let hitColor = CC.hitcolortest(this, CC.clr[2], CC.clr[24]);
			this.y = tempY;
			if (hitColor) {
				if (this.dir == 1) {
					this.dir = -1;
					this.strDir = "Left";
				} else {
					this.dir = 1;
					this.strDir = "Right";
				}
				this.shape = CC["heli"+this.strDir+(this.shapeNum+1)];
			}
			if (CC.collide(game.shot,  this) && !this.out && game.shot.y >=0) {
				this.t_expl = 40;
				this.out = true;
				game.shot.y = -100;
				console.log("Shot collided with Heli");
			} else if (CC.collide(game.plane, this) && !this.out) {
				this.t_expl = 40;
				this.out = true;
				game.plane.losePlane();
				console.log("Plane collided with Heli");
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
