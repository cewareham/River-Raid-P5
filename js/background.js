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
		this.maxLevel = 11;
		this.levelName = "assets/lvl";
		this.levelExt = ".png";
		console.log(this.imgs[0]);
		this.color = color('black');
		this.render = this.nullRender;
		this.horizontalTiles = horizontalTiles;
		this.scrollSpeed = 5;           // scrolling speed

		this.top = 0;                   // stagePosY y-coord to display top of image @ top of canvas
		this.bottom = -height;          // stagePosY y-coord to display bottom of image @ bottom of canvas
		this.stagePosY = this.bottom;   // initial pos -> bottom of image @ bottom of canvas
		this.stagePosX = 0;
		this.calledLoadImage = false;

		this.setTiles(this.imgs);
	}

	setTiles = (tiles) => {
		this.numLoaded = 0;                 // no imgs loaded yet
		this.render = this.nullRender;      // pause rendering until imgs loaded
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
			this.scroll(0, 0);              // display initial image
			this.render = this.realRender;  // start rendering
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

	update = () => {
		// load new level image if prev one is offscreen (except for repeating level 1)
		if (this.stagePosY < -this.numImgs*this.tileHeight-height && !this.calledLoadImage) {
				this.render = this.nullRender; // stop rendering until new image loaded

				this.lastLevel++;
				if (this.lastLevel > this.maxLevel) this.lastLevel = 2;    // warp around to start
				console.log("Level " + this.lastLevel + " loaded");
				let path = this.levelName + String(this.lastLevel).padStart(3, '0') + this.levelExt;
				this.tiles[0][0] = loadImage(path, this.newLevelLoaded);
				this.calledLoadImage = true;
		}
	}

	newLevelLoaded = () => {
		this.stagePosY += this.numImgs*(this.tileHeight);  // reset new level image position
		this.calledLoadImage = false;      // flag so we don't load image more than once
		this.render = this.realRender;     // new level loaded & in place->restart rendering
	}

	// call the do-nothing render until all
	//  image(s) loaded then call realRender
	nullRender() {}

	realRender = (dy) => {
		this.scroll(0, dy);
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
		return toInt(def, 0);
	}
}
