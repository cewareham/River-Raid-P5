"use strict";

// Bridge class
class Bridge {
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
        this.firstTime = true;
    }

    collide = (obj) => {
        if (this.onScreen()) {
            return CC.collide(obj, this);
        }
        return false;
    }

    // is bridge y-coord on visible canvas?
	onScreen = () => {
		this.screenY = this.dHeight + this.y;
		return (this.screenY < height && this.screenY > -this.shape.height);
	}

	update = (dy) => {
        this.y += dy;
        if (!this.isFirstBridge() && this.collide(game.plane) && !this.out) {
            this.t_expl = 40;
            game.plane.t_expl = 40;
            this.out = true;
            console.log("Plane collided with Bridge");    
        } 
	}

	render = () => {
        let img = this.shape;
        if (!this.isFirstBridge()) {
            if (this.t_expl) {
                if (this.t_expl > 20) img = CC.bridgeEx1;
                else img = CC.bridgeEx2;
                this.t_expl--;
                if (this.t_expl == 0) this.out = false;
            }

            if (this.onScreen()) {
                image(img, this.x, this.screenY);
            }        
        }
    }
    
    // is this the first bridge? don't draw it if it is
    isFirstBridge = () => {
        if (this.index == 0 && this.firstTime) {
            if (this.y > CC.tileHeight) {
                this.firstTime = false;
            }
            return true;
        }
        return false;
    }
}
