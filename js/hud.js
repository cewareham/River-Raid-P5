"use strict";

//**** TO DO:
//*****  display/update lives
//*****  display/update score
//*****  display/update text

// Hud class
class Hud {
	constructor(hudPath, indPath, maxFuel) {
        // hud graphic
        this.hud = createImg(hudPath, "");
        this.hud.size(width-4, 120);
        this.hud.style('border', '2px solid black');

        // gauge indicator graphic
        this.ind = createImg(indPath, "");
        this.ind.size(10, 28);

        this.maxFuel = maxFuel;
        this.indLeft = 313;     // canvas coord-left edge of hud/canvas to 'E' indicator
        this.indRight = this.indLeft + maxFuel; // canvas coord-left edge of hud/canvas to 'F' indicator
        this.dY = 50;   // dist from top of hud to top of indicator
        this.indX;
        this.indY;
        this.hudX;
        this.hudY;
        this.xx;
        this.yy;
        this.firstTime = true;
        this.update(this.maxFuel);  // start with full tank
    }

    update = (fuelLevel) => {
        this.updateCoords();
        this.setHud();
        this.setIndicator(fuelLevel);
    }

    updateCoords = () => {
        this.xx = Math.round((windowWidth - width) / 2);
        this.yy = Math.round((windowHeight - height - this.hud.height) / 2);
    }

    updateHud = () => {
        this.updateCoords();
        this.setHud();
    }

    updateIndicator = (fuelLevel) => {
        this.updateCoords();
        // set hud 1st time since it doesn't get set right from constructor
        if (this.firstTime) {
            console.log("*** update hud first time ***");
            this.setHud();
            this.firstTime = false;
        }
        this.setIndicator(fuelLevel);
    }

    setHud = () => {
        this.hudX = this.xx;
        this.hudY = this.yy+height;
        this.hud.position(this.hudX, this.hudY);
    }

    setIndicator = (fuelLevel) => {
        this.indX = this.xx+this.indLeft+fuelLevel;
        this.indY = this.yy+height+this.dY;
        let minX = this.hudX + this.indLeft;
        let maxX = this.hudX + this.indRight;
        if (this.indX < minX) this.indX = minX;
        if (this.indX > maxX) this.indX = maxX;
        this.ind.position(this.indX, this.indY);
    }
}
