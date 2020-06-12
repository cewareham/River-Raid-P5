"use strict";

class Shot {
    constructor(shooting, x, y) {
        this.x = x;
        this.y = y;
        this.w = 5;
        this.h = 15;
        this.shooting = shooting;
        this.speed = 20;
    }

    update() {
        if (keyIsDown(32)) {      // keycode 32 = space bar
            this.shooting = true;
            // if (this.y == game.plane.y - 15) {  // game is global var
            //     ASSETS.sndShot.stop();
            //     ASSETS.sndShot.play();
            // }
        }
    }

    render(planex, planey) {
        // hitcolortext(..) won't work in update(), ONLY works in render()!
        if (CC.hitcolortest(this, CC.clr[2], CC.clr[24])) {
			console.log("!!! SHOT hit terrain !!!");
            this.y = -this.h;
		}

        if (this.shooting) {
            this.shooting = false;
            if (this.y < 0) {
                this.x = planex;
                this.y = planey;
            }
        }
        if (this.y > -this.h) {
            this.y -= this.speed;
        }
        noStroke();
        fill(CC.clr[13]);
        rect(this.x, this.y, this.w, this.h);
    }
}
