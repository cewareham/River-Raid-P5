"use strict";

// src: "https://github.com/StevePaget/Pygame_Functions (python source code)
// https://www.youtube.com/playlist?list=PLeOSHd3t9lzKr4O3A3Q7OZyf8QwyCALyn (Pygame_Functions videos)

// 3 possible params for Background constructor:
//   1-> "img.png" -> single img path/filename
//   2 -> ["img1.png", "img2.png"] -> array of path/filenames (1x img ok)
//   (the above is 'long corridor'->all displayed horizontally)
//   3 -> [["img1.png", "img2.png"], ["img3.png", "img4.png"]] -> 2d array
//*** FIRST OPTION ***
//this.background = new Background("../images/dungeonFloor1.png");

//*** SECOND OPTION horizontal 1,2,3,4 left to right ***
// this.background = new Background(["../images/dungeonFloor1.png",
//                                   "../images/dungeonFloor2.png",
//                                   "../images/dungeonFloor3.png",
//                                   "../images/dungeonFloor4.png"]);

//*** SECOND OPTION vertical 1,2,3,4 top to bottom***
// this.background = new Background(["../images/dungeonFloor1.png",
//                                   "../images/dungeonFloor2.png",
//                                   "../images/dungeonFloor3.png",
//                                   "../images/dungeonFloor4.png"], false);

//*** THIRD OPTION ***
// this.background = new Background([ ["../images/dungeonFloor1.png", "../images/dungeonFloor2.png"],
//                                  ["../images/dungeonFloor3.png", "../images/dungeonFloor4.png"] ]);

class Background {
	constructor(imgs, horizontalTiles = true) {
		this.imgs = imgs;
		this.lastLevel = 2;
		this.repeatLevel = 2;
		//this.maxLevel = Math.floor(CC.houseData.length/2) + 1;
		this.maxLevel = CC.maps.length;
		this.horizontalTiles = horizontalTiles;
		this.scrollSpeed = 7;           // scrolling speed

		this.top = 0;                   // stagePosY y-coord to display top of image @ top of canvas
		this.bottom = -height;          // stagePosY y-coord to display bottom of image @ bottom of canvas
		// this.stagePosY = this.bottom;   // initial pos -> bottom of image @ bottom of canvas
		// this.stagePosX = 0;
		this.calledLoadImage = false;
		this.repeatLevelDone = false;
		// diff between bottom of screen & top of bridge MUST be bridgeDelta
		// used below to correct screen shift
		this.bridgDelta = CC.tileHeight - CC.bridgeData.y;

		this.setTiles(this.imgs);
	}

	setTiles = (tiles) => {
		this.numLoaded = 0;                 // no imgs loaded yet
		this.updateRenderOff();
		if (typeof tiles === 'string') {    // img=single path/filename string
			this.numImgs = 1;
			this.tiles = [[loadImage(tiles, this.tilesLoaded)]];
		} else if (typeof tiles[0] === 'string') {    // img=array of path/filename strings
			this.numImgs = this.imgs.length;
			if (this.horizontalTiles) {         // arrange tiles horizontally
					// BEGIN HORIZONTAL tiles 1,2,3,4 -> left to right
					this.tiles = [[]];
					tiles.forEach( (ii) => {
						this.tiles[0].push(loadImage(ii, this.tilesLoaded));
					});
					// END HORIZONTAL tiles 1,2,3,4 -> left to right
			} else {                            // arrange tiles vertically
					// BEGIN VERTICALLY stacked tiles -> 1,2,3,4 top to bottom
					this.tiles = [];
					tiles.forEach( (ii) => {
						this.tiles.push([loadImage(ii, this.tilesLoaded)]);
					});
					// END VERTICALLY stacked tiles -> 1,2,3,4 top to bottom
			}
		} else {                                    // img=2d array of path/filename strings
			this.numImgs = this.imgs[0].length * this.imgs[1].length;
			// create 2d array
			// src: https://www.geeksforgeeks.org/how-to-create-two-dimensional-array-in-javascript/
			this.tiles = new Array(this.imgs[0].length);
			for (let ii=0; ii<this.tiles.length; ii++) {
					this.tiles[ii] = [];
			}
			tiles[0].forEach( (ii) => {
					this.tiles[0].push(loadImage(ii, this.tilesLoaded));
			});
			tiles[1].forEach( (jj) => {
					this.tiles[1].push(loadImage(jj, this.tilesLoaded));
			});
		}
	}

	tilesLoaded = () => {
		this.tileWidth = this.tiles[0][0].width;
		this.tileHeight = this.tiles[0][0].height;
		this.numLoaded++;
		if (this.numLoaded == this.numImgs) {
			this.stagePosY = this.bottom;   // initial pos -> bottom of image @ bottom of canvas
			this.stagePosX = 0;
			this.scroll(0, 0);              // display initial image
			this.updateRenderOn();
		}
	}

	scroll = (xx, yy) => {
		this.stagePosX -= xx;
		this.stagePosY -= yy;

		let mm = this.mod(this.stagePosX, this.tileWidth * this.tiles[0].length);
		let col = this.toInt(mm / this.tileWidth);
		let xOff = (0 - this.mod(this.stagePosX, this.tileWidth));
		mm = this.mod(this.stagePosY, this.tileHeight * this.tiles.length);
		let row = this.toInt(mm / this.tileHeight);
		let yOff = (0 - this.mod(this.stagePosY, this.tileHeight));

		mm = this.mod(this.stagePosX + this.tileWidth, this.tileWidth * this.tiles[0].length);
		let col2 = this.toInt(mm / this.tileWidth);
		mm = this.mod(this.stagePosY + this.tileHeight, this.tileHeight * this.tiles.length);
		let row2 = this.toInt(mm / this.tileHeight);

		image(this.tiles[row][col], xOff, yOff);
		image(this.tiles[row][col2], xOff + this.tileWidth, yOff);
		image(this.tiles[row2][col], xOff, yOff + this.tileHeight);
		image(this.tiles[row2][col2], xOff + this.tileWidth, yOff + this.tileHeight);
	}

	// make houses, fuel, boats & helicopters
	makeObjects = (idx1, idx2) => {
		game.makeHouses(idx1, idx2);
		game.makeFuel(idx1, idx2);
		game.makeBoats(idx1, idx2);
		game.makeJets(idx1, idx2);
		game.makeHelis(idx1, idx2);
	}

	render = (dy) => {
		//background('blue');
		this.scroll(0, dy);
	}

	update = () => {
		// 1st (repeated) level off screen -> load new house data
		if (this.stagePosY < -this.tileHeight-height && !this.repeatLevelDone) {
			// don't go beyond CC.houseData array bounds
			if (this.repeatLevel < CC.houseData.length) {
				let idx1 = this.repeatLevel-1;	// non-repeated level
				let idx2 = this.repeatLevel;	// repeated level
				this.makeObjects(idx1, idx2);	// load house, fuel, boats & helicopters for both levels because we need array init
				//console.log(game.bridges[0].out, game.bridges[1].out);
				// console.log("*** NEW LEVEL repeatLevel makeHouses(), makeFuel(), makeBoats(), makeHelis()");
				// console.log("\n");
				this.repeatLevel++;				// next level index into houseData
			} else {	// this.repeatLevel >= CC.houseData.length -> wrap around to start for house, fuel, boat & helicopter data
				this.makeObjects(CC.houseData.length-1, 0);
				this.repeatLevel = 1;
			 	console.log('!!! WRAPPING AROUND repeatLevel = !!!', this.repeatLevel);
				console.log("\n");
			}
			game.bridges[0].y -= this.numImgs*CC.tileHeight;	// move 1st bridge up
			this.repeatLevelDone = true;	// set flag so we don't do again until next level loaded
		}
		// 2nd (non-repeated) level off screen -> load new level image & house data (in newLevelLoaded())
		if (this.stagePosY < -this.numImgs*this.tileHeight-height && !this.calledLoadImage) {
				this.updateRenderOff();

				this.lastLevel++;
				if (this.lastLevel > this.maxLevel) {
					this.lastLevel = 2;		// wrap around to start for loading images
				}
				//let path = this.levelName + String(this.lastLevel).padStart(3, '0') + this.levelExt;
				let path = CC.maps[this.lastLevel-1];
				console.log("Map " + this.lastLevel + " loaded->", path, "stagePosY = " + this.stagePosY);
				this.tiles[0][0] = loadImage(path, this.newLevelLoaded);

				this.calledLoadImage = true;	// set to true so this code-block does not execute again until image loaded
				this.repeatLevelDone = false;	// set to false so 1st-level-offscreen code (above) executes
		}
	}

	newLevelLoaded = () => {
		//this.stagePosY = this.bottom;	// put bottom of loaded screen at bottom of canvas
		//let delta = this.stagePosY + 2 * 2692 + 600;
		//this.stagePosY = delta - 600;
		let temp = this.stagePosY;
		this.stagePosY += 2 * CC.tileHeight;
		console.log(temp, this.stagePosY);
		this.scroll(0, 0);				// display loaded screen @ new pos
		console.log("stagePosY = " + this.stagePosY);
		this.makeObjects(this.repeatLevel-1, this.repeatLevel);
		game.bridges[0].y = CC.bridgeData.y + (abs(this.stagePosY)-height);					// adjust bridge positions
		game.bridges[1].y = CC.bridgeData.y - CC.tileHeight + (abs(this.stagePosY)-height);
		this.repeatLevel++;

		this.calledLoadImage = false;		// flag so we don't load image more than once
		this.repeatLevelDone = false;		// set flag so we don't do again until next level loaded
		this.updateRenderOn();
	}

	// call the do-nothing render until all
	//  image(s) loaded then call realRender
	// MUST turn ALL updating/rendering off in game class
	updateRenderOff = () => {
		if (game) game.updateRenderOff();
	}

	// turn ALL normal updating/rendering on in game class
	updateRenderOn = () => {
		if (game) game.updateRenderOn();
	}

	// python's true modulo NOT JS' remainder
	// src: https://math.stackexchange.com/questions/674419/is-there-a-formula-for-modulo
	mod = (xx, yy) => {
		return xx - yy * Math.floor(xx/yy);
	}

	toInt(obj, def) {
		if (obj !== null) {
			var x = parseInt(obj, 10);
			if (!isNaN(x)) return x;
		}
		return this.toInt(def, 0);
	}
}
