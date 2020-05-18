"use strict";

let game, CC = {};

function preload() {
  CC.lvl01 = loadImage('assets/lvl01.png');
  CC.lvl02 = loadImage('assets/lvl02.png');
  CC.lvl03 = loadImage('assets/lvl03.png');
}

function setup() {
    let canvas = createCanvas(800, 600);
    game = new Game(canvas);
    image(CC.lvl01, 0, 0);
}


function draw() {
    //background(0, 255, 0);
    game.update();
    game.render();
}

// center the canvas whenever the browser changes size
function windowResized() {
    game.centerCanvas();
}
