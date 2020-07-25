"use strict";

// Game class
class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.centerCanvas();
		//this.bg = new Background(['assets/lvl002.png', 'assets/lvl001.png'], false);
		this.bg = new Background([CC.maps[1], CC.maps[0]], false);
		this.houses= [];
		this.bridges = [];
		this.fuels = [];
		this.boats = [];
		this.jets = [];
		this.helis = [];
		this.level = 0;
		let planeWidth = 49,
			planeHeight = 42,
			planeX = Math.round(CC.bridgeData.x + CC.bridge.width/2 - planeWidth/2),
			planeY = height - 60;
		this.shot = new Shot(false, 0, 1);
		//                      x         y     width            height  shape#        out expl
		this.plane = new Plane(planeX, planeY, planeWidth, planeHeight, CC.eShape.PLANE, 0, 0);
		this.makeHouses(this.level, this.level+1);	// make level 1 houses/trees
		this.makeFuel(this.level, this.level+1);
		this.makeBoats(this.level, this.level+1);
		this.makeJets(this.level, this.level+1);
		this.makeHelis(this.level, this.level+1);
		this.makeBridges(0, 1);	// make level 1 bridges
		this.scrollSpeed = this.bg.scrollSpeed;

		this.minFuel = 0;
		this.maxFuel = 166;		// pixel dist from 'E' fo 'F' indicators on hud image
		this.fuel_level = this.maxFuel;
		this.hud = new Hud("assets/hud.png", "assets/bullet.png", "assets/plane.png", this.maxFuel);
		this.displayMsg = "River Blitz P5";	// msg to display in hud
		this.score = 10235;
		this.centerCanvas();
		this.updateRenderOn();
	}

	//*** BEGIN Bridges code ***
	makeBridges = (offset1, offset2) => {
		this.bridges = [];
		this.newBridge(offset1);
		this.newBridge(offset2);
	}
	newBridge = (offset) => {
		let bd = CC.bridgeData;
		let xx = bd.x;
		let yy = bd.y;
		if (offset) yy -= offset*CC.tileHeight;
		let img = CC.bridge;
		this.bridges.push(new Bridge(xx, yy, img.width, img.height, img, offset, 0, 0));
	}
	renderBridges = (dy) => {
		for (let ii=0; ii<this.bridges.length; ii++) {
			this.bridges[ii].update(dy);
			this.bridges[ii].render();
		}
	}
	//*** END Bridges code ***

	//*** BEGIN Houses code ***
	replaceHouses = (idx) => {
		this.houses.splice(0, CC.houseData[idx-2].length)	// keep previous house data
		this.newHouses(idx, 1);								// add new house data
	}
	makeHouses = (idx1, idx2) => {
		this.houses = [];
		this.newHouses(idx1, 0);		// make level 1 houses/trees
		this.newHouses(idx2, 1);		// make level 2 houses/trees
	}
	newHouses = (idx, offset) => {
		let hd = CC.houseData[idx];
		for (let ii=0; ii<hd.length; ii++) {
			let obj = hd[ii];
			let xx = obj.x;
			let yy = obj.y;
			if (offset) yy -= offset*CC.tileHeight;
			let img = (obj.img == "L" ? CC.houseLeft : CC.houseRight);
			this.houses.push(new House(xx, yy, img.width, img.height, img, ii));
		}
	}
	renderHouses = (dy) => {
		for (let ii=0; ii<this.houses.length; ii++) {
			this.houses[ii].update(dy);
			this.houses[ii].render();
		}
	}
	//*** END Houses code ***

	//*** BEGIN Fuel code ***
	makeFuel = (idx1, idx2) => {
		this.fuels = [];
		this.newFuel(idx1, 0);
		this.newFuel(idx2, 1);
	}
	newFuel = (idx, offset) => {
		let fd = CC.fuelData[idx];
		for (let ii=0; ii<fd.length; ii++) {
			let obj = fd[ii];
			let xx = obj.x;
			let yy = obj.y;
			if (offset) yy -= offset*CC.tileHeight;
			let img = CC.fuel;
			this.fuels.push(new Fuel(xx, yy, img.width, img.height, img, ii, 0, 0));
		}
	}
	renderFuel = (dy) => {
		for (let ii=0; ii<this.fuels.length; ii++) {
			this.fuels[ii].update(dy);
			this.fuels[ii].render();
		}
	}
	//*** END Fuel code ***

	//*** BEGIN Jet code ***
	makeJets = (idx1, idx2) => {
		this.jets = [];
		this.newJets(idx1, 0);
		this.newJets(idx2, 1);
	}
	newJets = (idx, offset) => {
		let jd = CC.jetData[idx];
		for (let ii=0; ii<jd.length; ii++) {
			let obj = jd[ii];
			let xx = obj.x;
			let yy = obj.y;
			if (offset) yy -= offset*CC.tileHeight;
			let dir = (ii%2==0 ? "Left" : "Right");

			//let img = (ii%2==0 ? CC.boatLeft : CC.boatRight);
			this.jets.push(new Jet(xx, yy, dir, ii, 0, 0));
		}
	}
	renderJets = (dy) => {
		for (let ii=0; ii<this.jets.length; ii++) {
			this.jets[ii].update(dy);
			this.jets[ii].render();
		}
	}
	//*** END Jet code ***

	//*** BEGIN Boat code ***
	makeBoats = (idx1, idx2) => {
		this.boats = [];
		this.newBoats(idx1, 0);
		this.newBoats(idx2, 1);
	}
	newBoats = (idx, offset) => {
		let bd = CC.boatData[idx];
		for (let ii=0; ii<bd.length; ii++) {
			let obj = bd[ii];
			let xx = obj.x;
			let yy = obj.y;
			if (offset) yy -= offset*CC.tileHeight;
			let dir = (ii%2==0 ? "Left" : "Right");

			//let img = (ii%2==0 ? CC.boatLeft : CC.boatRight);
			this.boats.push(new Boat(xx, yy, dir, ii, 0, 0));
		}
	}
	renderBoats = (dy) => {
		for (let ii=0; ii<this.boats.length; ii++) {
			this.boats[ii].update(dy);
			this.boats[ii].render();
		}
	}
	//*** END Boat code ***

	//*** BEGIN Helicopter code ***
	makeHelis = (idx1, idx2) => {
		this.helis = [];
		this.newHelis(idx1, 0);
		this.newHelis(idx2, 1);
	}
	newHelis = (idx, offset) => {
		let hd = CC.heliData[idx];
		for (let ii=0; ii<hd.length; ii++) {
			let obj = hd[ii];
			let xx = obj.x;
			let yy = obj.y;
			if (offset) yy -= offset*CC.tileHeight;
			let dir = (ii%2==0 ? "Left" : "Right");
			let imgNum = 1;
			this.helis.push(new Heli(xx, yy, dir, imgNum, ii, 0, 0));
		}
	}
	renderHelis = (dy) => {
		for (let ii=0; ii<this.helis.length; ii++) {
			this.helis[ii].update(dy);
			this.helis[ii].render();
		}
	}
	//*** END Helicopter code ***

	realUpdate() {
		this.fuel_level -= 0.1;
		if (this.fuel_level < this.minFuel) this.fuel_level = this.minFuel;
		this.bg.update();
		this.plane.update();
		this.shot.update();
		this.hud.updateIndicator(this.fuel_level);
		this.hud.displayMsg(this.displayMsg);
		this.hud.updateScore(Math.round(this.fuel_level)/*this.score*/);
	}
  
	realRender() {
		let speed = 0;
		if (keyIsDown(DOWN_ARROW)) {
			speed = -this.scrollSpeed;
		}
		else if (keyIsDown(UP_ARROW)) {
			speed = this.scrollSpeed;
		}

		this.bg.render(speed);
		this.renderHouses(speed);
		this.renderBridges(speed);
		this.renderFuel(speed);
		this.renderBoats(speed);
		this.renderJets(speed);
		this.renderHelis(speed);
		this.plane.render();
		this.shot.render(round(game.plane.x + game.plane.w/2), round(game.plane.y + game.plane.h/2));
	}

	nullUpdate = () => { }
	nullRender = () => { }

	updateRenderOff = () => {
		this.render = this.nullRender;
		this.update = this.nullUpdate;
	}
	updateRenderOn = () => {
		this.render = this.realRender;
		this.update = this.realUpdate;
	}

	centerCanvas() {
		if (!this.hud) return;
		var xx = (windowWidth - width) / 2;
		var yy = (windowHeight - height - this.hud.hud.height) / 2;
		this.canvas.position(xx, yy);
		this.hud.update(this.fuel_level);
	}
}
