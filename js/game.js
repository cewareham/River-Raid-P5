"use strict";

// Game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.centerCanvas();
        this.bg = new BackgroundVerticalScroll([CC.lvl01, CC.lvl02, CC.lvl01, CC.lvl03], 0);
    }
  
    update() {
        this.bg.update();
    }
  
    render() {
        this.bg.render();
        //background(clr[3]);     // river -> blue
    }

    centerCanvas() {
        var xx = (windowWidth - width) / 2;
        var yy = (windowHeight - height) / 2;
        this.canvas.position(xx, yy);
    }
}
