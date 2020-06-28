"use strict";

// Hud class
class Hud {
	constructor(hudPath, indPath, planePath, maxFuel) {
        // hud graphic
        this.hud = createImg(hudPath, "");
        this.hud.size(width-4, 120);
        this.hud.style('border', '2px solid black');

        // gauge indicator graphic
        this.ind = createImg(indPath, "");
        this.ind.size(10, 28);

        // show lives with plane graphic
        this.maxLives = 3;
        this.lives = this.maxLives;
        this.planeLives = [];
        this.planeWidth = 28;   // 25
        this.planeHeight = 28;  // 21
        for (let ii=0; ii<this.maxLives; ii++) {
            this.planeLives.push(ii);
            // plane graphic to show lives
            this.planeLives[ii] = createImg(planePath, "");
            this.planeLives[ii].size(this.planeWidth, this.planeHeight);
        }

        // div for msg display
        this.msgDiv = createDiv();
        this.msgDiv.size(this.hud.width, 50);
        this.msgDiv.style('font-family', 'CooperBlackRegular');
        this.msgDiv.style('font-size', '30px');
        this.msgDiv.style('color', CC.clr[1]);
        this.msgDiv.style('text-align', 'center');

        // div for score display
        this.scoreDiv = createDiv();
        this.scoreDiv.size(this.hud.width/2, 50);
        this.scoreDiv.style('font-family', 'CooperBlackRegular');
        this.scoreDiv.style('font-size', '30px');
        this.scoreDiv.style('color', CC.clr[1]);
        this.scoreDiv.style('text-align', 'left');

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

    updateScore = (score) => {
        this.scoreDiv.html("Score: " + score);
        this.scoreDiv.position(this.hudX+20, this.hudY);

    }

    displayMsg = (msg) => {
        this.msgDiv.html(msg);
        this.msgDiv.position(this.hudX, this.hudY+this.hud.height-38);
    }

    updateLives = () => {
        for (let ii=0; ii<this.maxLives; ii++) {
            if (ii < this.lives) {
                let plSpacing = 10,
                    plX = this.hudX + width + (ii-(this.maxLives+1))*(this.planeWidth+plSpacing),
                    plY = this.hudY+10;
                this.planeLives[ii].position(plX, plY);
            } else {
                this.planeLives[ii].position(-100, -100);
            }
        }
    }

    update = (fuelLevel) => {
        this.updateCoords();
        this.setHud();
        this.setIndicator(fuelLevel);
        this.updateLives();
        this.updateScore();
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
