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
        this.needBridge = false;
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
        let ii = 1;
        let blinkLoop = function() {
            CC.bgColor = (ii % 2 == 0) ? CC.flashred : CC.waterblue;
            setTimeout(function () {			
                ii++;
                if (ii < 10) blinkLoop();
                else CC.bgColor = CC.waterblue;
            }, 50);
        };
        this.y += dy;
        if (!this.isFirstBridge() && this.onScreen()) {
            if (this.collide(game.plane) && !this.out) {
                this.t_expl = 40;
                game.plane.t_expl = 40;
                this.out = true;
                game.hud.lives--;
                if (game.hud.lives < 0) game.hud.lives = 0;
                game.hud.updateLives();
                console.log("Plane collided with Bridge");
                blinkLoop();
            } else if (this.collide(game.shot) && !this.out && game.shot.y >=0) {
                this.t_expl = 40;
                this.out = true;
                game.shot.y = -100;
                console.log("Shot collided with Bridge");
                blinkLoop();
            }
        }
    }

	render = () => {
        let img = this.shape;
        if (!this.isFirstBridge()) {
            if (this.t_expl) {
                if (this.t_expl > 20) img = CC.bridgeEx1;
                else img = CC.bridgeEx2;
                this.t_expl--;
                if (this.t_expl == 0) this.needBridge = true;
            }

            if (this.onScreen()) {                      // only draw bridge if it's onscreen AND
                if (!this.out || this.t_expl)           // its not out or it is out and there's explosion animation to finish
                    image(img, this.x, this.screenY);
            } else if (this.needBridge) {
                // if bridge explosion done don't reset this.out until bridge is offscreen
                // otherwise plane will explode/hit bridge after bridge blows up
                this.out = false;
                this.needBridge = false;
            }
        }
    }
    
    // don't draw 1st bridge (opening screen)
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
