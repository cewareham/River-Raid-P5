"use strict";

// final name for game: #1-River Blitz, #2-River Assault or #3-Stream Attack

let CC = {
	collide: function(obj1, obj2) {
		return (obj1.x+obj1.w>obj2.x && obj1.x<obj2.x+obj2.w
			&& obj1.y+obj1.h>obj2.screenY && obj1.y<obj2.screenY+obj2.h);
	},

	// need 2 clr values because have 2 terrain colors to test-ltgreen & dkgreen
	hitcolortest: function(obj, clr1, clr2) {
		// clr format is eg. "#6E9C42"
		// p5.js get(x, y) returns color value format eg. [45, 50, 184, 255]->rgba array
		// so must convert get(x, y) value to clr format with p5.js hex(..) function below
		//*** ONLY check if obj is on canvas ***
		if (obj.x >= 0 && obj.x + obj.w <= width && obj.y >= 0 && obj.y + obj.h <= height) {
			for (let ii=0; ii<floor(obj.w); ii++) {
				for (let jj=0; jj<floor(obj.h); jj++) {
					if ((!ii && (!jj || jj == floor(obj.h) - 1)) || !jj && ii == floor(obj.w) - 1) {
						let pixelData = get(floor(obj.x + ii), floor(obj.y + jj));
						let pixelHex = '#' + this.rgbToHex( pixelData[0], pixelData[1], pixelData[2] );
						//let pixelHex = '#' + hex(pixelData[0], 2) + hex(pixelData[1], 2) + hex(pixelData[2], 2);
						//console.log("canvasColor = " + canvasColor, obj.x+ii, obj.y+jj);
						//document.getElementById('status').innerHTML = "(" + obj.x + "," + obj.y + ")->" + pixelData + "->" + pixelHex;
						if (pixelHex == clr1 || pixelHex == clr2) return true;
					}
				}
			}
		}
		return false;
	},		

	rgbToHex: function(r, g, b) {
		// if (r > 255 || g > 255 || b > 255)
		// 	throw "Invalid color component";
		return ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
	},
	
	KEY_P: 80,		// P key
	KEY_F2: 113,	// F2 key

	/*
	0-null, 1-airplane, 2-bottom, 3-water, (4-propeller, 5-body, 6-middle), (7-cabin, 8-deck, 9-hull),
	(10-base, 11-asphalt, (1-banner), (12-fuel, 13-white), 14-panel, (1)-letters, ((13-Wall),
	15-tree, 16-trunk), (17-support, 18-board1- 19-board2, (1-banner),(13-shot))
	*/
	clr:
		//     0      1-yellow   2-lt green   3-dk blue      4          5          6         7
		[  '#000000', '#E8E84A', '#6E9C42',   '#2D32B8', '#D2A44A', '#004030', '#000089', '#000000',
    	//     8          9          10        11         12         13          14        15   
           '#A33915', '#54A0C5', '#6F6F6F', '#AAAAAA', '#D65C5C', '#D6D6D6', '#8E8E8E', '#9ED065',
    	//     16        17         18         19         20         21         22        23
		   '#474700', '#7C2C00', '#86861D', '#69690F', '#BBBB35', '#75CCEB', '#75B5EF', '#355F18',
		// 24-dkgreen
		   '#355F18'],
	
	yellow: 0,		// plane color
	ltgreen: 0,		// terrain color of repeating levels
	dkgreen: 0,		// terrain color of non-repeating levels
	waterblue: 0,	// color of water
	flashred: '#ab1919',		// flash bg red when bridge blows up
	bgColor: 0,		// background color-used in Background class->render()

	bridgeData: {x: 295, y: 2629},

    // indexes into shapes array - easier than using #s
    eShape: {
        PLANE: 0, PLANE_LEFT: 1, PLANE_RIGHT: 2, HELI_RIGHT0: 3, HELI_RIGHT1: 4,
        HELI_LEFT0: 5, HELI_LEFT1: 6, SHIP_RIGHT: 7, SHIP_LEFT: 8, AIRPLANE_E: 9,
        AIRPLANE_D: 10, FUEL: 11, EXPL1:12, EXPL2: 13, HOME: 14
	},
	
	// background -> river/terrain maps
	// maps: [	'assets/lvl001.png', 'assets/lvl002.png', 'assets/lvl003.png', 'assets/lvl004.png',
	// 		'assets/lvl005.png', 'assets/lvl006.png', 'assets/lvl007.png', 'assets/lvl008.png',
	// 		'assets/lvl009.png', 'assets/lvl010.png', 'assets/lvl011.png'
	// ],

	// background -> river/terrain maps
	// map001.png is repeated between map002.png, map004.png, map006.png, etc. (map is repeated but not enemy locations)
	maps: [	'assets/map001.png', 'assets/map002.png', 'assets/map004.png', 'assets/map006.png',
			'assets/map008.png', 'assets/map010.png', 'assets/map012.png', 'assets/map014.png',
			'assets/map016.png', 'assets/map018.png', 'assets/map020.png'
	],

	plane:
	[
		[[0, 0, 0, 1, 0, 0, 0], // 0 plane -> array of color values
        [0, 0, 0, 1, 0, 0, 0],  //  indexed into clr array
        [0, 0, 0, 1, 0, 0, 0],  // plane is 7 pixels wide x 14 pixels tall
        [0, 0, 1, 1, 1, 0, 0],  // show(..) draw image to fit specified w (width) & h (height)!
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0]],
	
        [[0, 0, 0, 1, 0, 0, 0],  // 1 plane left
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 0, 0],
        [0, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 0]],
	
        [[0, 0, 0, 1, 0, 0, 0],  // 2 plane right
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 1, 0],
		[0, 1, 0, 0, 0, 0, 0]]
	],

	explosion:
	[
		[[0, 0, 0, 0, 0, 8, 0, 0],      // explosion 1
		[0, 0, 0, 8, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 8, 0],
		[8, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 6, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 0, 4],
		[0, 4, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 4, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 4, 0],
		[9, 0, 0, 0, 1, 0, 0, 0],
		[0, 0, 9, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 9, 0, 0]],

		[[0, 0, 15, 0, 0, 0],           // explosion 2
		[0, 0, 0, 0, 15, 0],
		[15, 0, 0, 0, 0, 0],
		[0, 0, 0, 15, 0, 0],
		[0, 15, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 15],
		[0, 0, 9, 0, 0, 0],
		[0, 0, 0, 0, 9, 0]],
	],

	jetData: [
		[  ],								// map001.png -> no jets
		[  ],								// map002.png -> no jets

		[	{x: 227, y: 1218, img: "L"},	// map003.png
			{x: 348, y: 1471, img: "L"}],
		
		[	{x: 137, y:  461, img: "L"},	// map004.png
			{x: 158, y:  794, img: "R"},
			{x: 111, y: 1219, img: "L"},
			{x: 547, y: 1640, img: "L"}],

		[	{x: 432, y: 1216, img: "L"},	// map005.png
			{x: 427, y: 1635, img: "R"},
			{x: 379, y: 2060, img: "L"}],

		[	{x: 164, y: 1046, img: "R"},	// map006.png
			{x:  47, y: 2060, img: "L"}],

		[	{x: 358, y:  120, img: "R"},	// map007.png
			{x: 427, y: 1134, img: "L"}],

		[  ],								// map008.png -> no jets

		[	{x: 180, y: 2315, img: "L"}],	// map009.png

		[	{x: 110, y: 1723, img: "L"},	// map010.png
			{x: 390, y: 2313, img: "L"}],

		[	{x: 500, y:  373, img: "R"},	// map11.png
			{x: 222, y:  709, img: "R"},
			{x: 332, y: 1640, img: "L"}],

		[	{x: 137, y: 289, img: "R"},		// map012.png
			{x: 563, y: 709, img: "R"}],

		[	{x: 251, y: 289, img: "L"},		// map013.png
			{x: 394, y: 709, img: "L"}],

		[	{x: 436, y:  540, img: "L"},	// map014.png
			{x: 547, y: 1804, img: "R"},
			{x: 122, y: 2226, img: "L"}],

		[	{x: 431, y: 879, img: "L"}],	// map015.png

		[	{x: 364, y:   36, img: "L"},	// map016.png
			{x: 664, y: 1298, img: "R"},
			{x: 131, y: 1720, img: "L"}],

		[	{x: 299, y: 1550, img: "R"}],	// map017.png

		[	{x: 652, y:  121, img: "L"},	// map018.png
			{x: 190, y:  456, img: "L"},
			{x: 231, y: 1805, img: "L"},
			{x: 363, y: 2395, img: "L"}],

		[	{x: 447, y:  288, img: "R"},	// map019.png
			{x: 472, y: 1383, img: "L"},
			{x: 284, y: 1719, img: "R"}],

		[	{x: 232, y: 1131, img: "L"},	// map020.png
			{x: 590, y: 1468, img: "L"}]
	],

	boatData: [
		[	{x: 326, y: 44},	// map001.png
			{x: 435, y: 465},
			{x: 306, y: 1139},
			{x: 436, y: 1308},
			{x: 331, y: 2476}],
			
		[	{x: 169, y: 294},	// map002.png
			{x: 411, y: 1222},
			{x: 252, y: 1306},
			{x: 462, y: 1559},
			{x: 199, y: 1643},
			{x: 450, y: 2318},
			{x: 410, y: 2485}],
			
		[	{x: 325, y: 43},	// map003.png
			{x: 256, y: 464},
			{x: 242, y: 549},
			{x: 315, y: 801},
			{x: 406, y: 1305},
			{x: 294, y: 1559},
			{x: 429, y: 1642},
			{x: 436, y: 2486}],
				
		[	{x: 326, y: 41},	// map004.png
			{x: 589, y: 379},
			{x: 73, y: 1391},
			{x: 579, y: 1477},
			{x: 170, y: 1811},
			{x: 410, y: 2064}],
				
		[	{x: 359, y: 42},	// map005.png
			{x: 463, y: 128},
			{x: 469, y: 800},
			{x: 272, y: 2400}],

		[	{x: 610, y: 633},	// map006.png
			{x: 94, y: 715},
			{x: 566, y: 801},
			{x: 526, y: 970}],

		[	{x: 306, y: 43},	// map007.png
			{x: 206, y: 464},
			{x: 468, y: 717},
			{x: 469, y: 968},
			{x: 316, y: 1222},
			{x: 248, y: 1725},
			{x: 388, y: 1807},
			{x: 463, y: 1893},
			{x: 426, y: 2318}],
				
		[	{x: 433, y: 210},	// map008.png
			{x: 557, y: 462},
			{x: 578, y: 1979}],

		[	{x: 279, y: 886},	// map009.png
			{x: 236, y: 969},
			{x: 378, y: 1644},
			{x: 347, y: 1896}],

		[	{x: 495, y: 211},	// map010.png
			{x: 85, y: 381},
			{x: 85, y: 1306},
			{x: 578, y: 1390},
			{x: 579, y: 1559},
			{x: 84, y: 1644}],
				
			
		[	{x: 458, y: 296},	// map011.png
			{x: 237, y: 633},
			{x: 243, y: 971},
			{x: 468, y: 1474},
			{x: 331, y: 2232},
			{x: 429, y: 2316},
			{x: 469, y: 2486}],

		[	{x: 305, y: 43},	// map012.png
			{x: 116, y: 380},
			{x: 52, y: 465},
			{x: 432, y: 549}],
				
		[	{x: 468, y: 464},	// map013.png
			{x: 299, y: 802},
			{x: 305, y: 1393},
			{x: 420, y: 1476},
			{x: 466, y: 1561},
			{x: 270, y: 1726},
			{x: 232, y: 1812}],
				
		[	{x: 157, y: 127},	//  map014.png
			{x: 263, y: 632},
			{x: 264, y: 716}],
				
		[	{x: 469, y: 463},	// map015.png
			{x: 273, y: 1222},
			{x: 402, y: 1308},
			{x: 468, y: 1391},
			{x: 332, y: 1475},
			{x: 315, y: 1641},
			{x: 468, y: 2234},
			{x: 406, y: 2485}],
				
		[	{x: 526, y: 632},	// map016.png
			{x: 452, y: 1054},
			{x: 494, y: 1643},
			{x: 83, y: 1812},
			{x: 526, y: 2314},
			{x: 422, y: 2402}],
				
		[	{x: 395, y: 128},	// map017.png
			{x: 468, y: 633},
			{x: 435, y: 803},
			{x: 252, y: 1138},
			{x: 211, y: 1306},
			{x: 368, y: 1475},
			{x: 410, y: 1642},
			{x: 306, y: 1729},
			{x: 466, y: 2484}],
				
		[	{x: 61, y: 213},	// map018.png
			{x: 598, y: 379},
			{x: 607, y: 1476},
			{x: 210, y: 1558},
			{x: 208, y: 1643},
			{x: 188, y: 1728},
			{x: 567, y: 2148},
			{x: 441, y: 2232}],
				
		[	{x: 313, y: 211},	// map019.png
			{x: 383, y: 717},
			{x: 456, y: 802},
			{x: 468, y: 1474},
			{x: 358, y: 1644},
			{x: 377, y: 2150},
			{x: 456, y: 2232},
			{x: 468, y: 2401}],
				
		[	{x: 421, y: 128},	// map020.png
			{x: 157, y: 716},
			{x: 474, y: 1053},
			{x: 422, y: 1979}]
	],

	heliData: [
		[	{x: 290, y: 117},	// map001.png
			{x: 447, y: 370},
			{x: 468, y: 624},
			{x: 486, y: 959},
			{x: 436, y: 1212},
			{x: 347, y: 1550},
			{x: 256, y: 1718},
			{x: 307, y: 2306}],

		[	{x: 168, y: 370},	// map002.png
			{x: 485, y: 540},
			{x: 126, y: 875},
			{x: 86, y: 1465},
			{x: 85, y: 1803},
			{x: 253, y: 2055},
			{x: 463, y: 2223}],
		
		[	{x: 283, y: 1044},	// map003.png
			{x: 484, y: 1381},
			{x: 331, y: 1718},
			{x: 278, y: 1803},
			{x: 326, y: 1970},
			{x: 484, y: 2139},
			{x: 484, y: 2223}],

		[	{x: 84, y: 960},	// map004.png
			{x: 526, y: 1885}],
		
		[	{x: 500, y: 203},	// map005.png
			{x: 347, y: 285},
			{x: 441, y: 369},
			{x: 321, y: 455},
			{x: 426, y: 540},
			{x: 479, y: 623},
			{x: 516, y: 876},
			{x: 490, y: 1293},
			{x: 510, y: 1381},
			{x: 469, y: 1719},
			{x: 332, y: 1801},
			{x: 232, y: 1969},
			{x: 457, y: 2140},
			{x: 494, y: 2224},
			{x: 348, y: 2307}],
		
		[	{x: 663, y: 118},	// map006.png
			{x: 51, y: 286},
			{x: 156, y: 1212},
			{x: 641, y: 1632},
			{x: 664, y: 1885},
			{x: 53, y: 1969},
			{x: 93, y: 2223},
			{x: 95, y: 2391},
			{x: 94, y: 2474}],
		
		[	{x: 237, y: 285},	// map007.png
			{x: 343, y: 1045},
			{x: 426, y: 1296},
			{x: 254, y: 1466},
			{x: 393, y: 1549},
			{x: 294, y: 1634},
			{x: 500, y: 1968},
			{x: 348, y: 2054},
			{x: 442, y: 2140},
			{x: 322, y: 2223}],
		
		[	{x: 305, y: 32},	// map008.png
			{x: 54, y: 117},
			{x: 430, y: 286},
			{x: 158, y: 372},
			{x: 556, y: 540},
			{x: 200, y: 624},
			{x: 663, y: 706},
			{x: 664, y: 790},
			{x: 664, y: 876},
			{x: 664, y: 1043},
			{x: 665, y: 1128},
			{x: 664, y: 1213},
			{x: 623, y: 1296},
			{x: 664, y: 1380},
			{x: 664, y: 1718},
			{x: 537, y: 1802},
			{x: 578, y: 1885},
			{x: 600, y: 2392},
			{x: 599, y: 2475}],
		
		[	{x: 414, y: 202},	// map009.png
			{x: 473, y: 286},
			{x: 514, y: 455},
			{x: 362, y: 792},
			{x: 384, y: 1045},
			{x: 225, y: 1549},
			{x: 205, y: 2224},
			{x: 450, y: 2474}],
		
		[	{x: 307, y: 31},	// map010.png
			{x: 53, y: 117},
			{x: 579, y: 454},
			{x: 514, y: 706},
			{x: 52, y: 875},
			{x: 199, y: 1465},
			{x: 115, y: 1886},
			{x: 621, y: 2055},
			{x: 622, y: 2138},
			{x: 410, y: 2224},
			{x: 348, y: 2392},
			{x: 348, y: 2475}],
		
		[	{x: 271, y: 540},	// map011.png
			{x: 372, y: 792},
			{x: 455, y: 1213},
			{x: 327, y: 1297},
			{x: 510, y: 1549},
			{x: 273, y: 1719},
			{x: 405, y: 1801},
			{x: 248, y: 1970}],
		
		[	{x: 284, y: 623},	// map012.png
			{x: 157, y: 791},
			{x: 157, y: 874},
			{x: 664, y: 961},
			{x: 621, y: 1044},
			{x: 622, y: 1128},
			{x: 411, y: 1213},
			{x: 411, y: 1297},
			{x: 369, y: 1550},
			{x: 368, y: 1633},
			{x: 367, y: 1718},
			{x: 369, y: 1802},
			{x: 347, y: 2054},
			{x: 199, y: 2140},
			{x: 514, y: 2223},
			{x: 557, y: 2306}],
		
		[	{x: 319, y: 33},	// map013.png
			{x: 263, y: 623},
			{x: 295, y: 1209},
			{x: 215, y: 1887}],
		
		[	{x: 115, y: 285},	// map014.png
			{x: 495, y: 371},
			{x: 494, y: 453},
			{x: 663, y: 791},
			{x: 263, y: 875},
			{x: 452, y: 960},
			{x: 473, y: 1128},
			{x: 662, y: 1379},
			{x: 662, y: 1462},
			{x: 52, y: 1547},
			{x: 178, y: 1886},
			{x: 222, y: 1969},
			{x: 494, y: 2052},
			{x: 137, y: 2308},
			{x: 137, y: 2390}],
		
		[	{x: 306, y: 32},	// map015.png
			{x: 321, y: 118},
			{x: 258, y: 201},
			{x: 395, y: 287},
			{x: 515, y: 538},
			{x: 516, y: 624},
			{x: 514, y: 706},
			{x: 509, y: 1044},
			{x: 312, y: 1798},
			{x: 274, y: 2392}],
		
		[	{x: 665, y: 286},	// map016.png
			{x: 95, y: 369},
			{x: 619, y: 454},
			{x: 579, y: 539},
			{x: 324, y: 876},
			{x: 663, y: 960},
			{x: 536, y: 1550},
			{x: 137, y: 1886},
			{x: 114, y: 2137},
			{x: 577, y: 2221},
			{x: 242, y: 2476}],
		
		[	{x: 205, y: 1380},	// map017.png
			{x: 252, y: 1801},
			{x: 226, y: 1886},
			{x: 379, y: 1969},
			{x: 289, y: 2054},
			{x: 409, y: 2139},
			{x: 505, y: 2306}],
		
		[	{x: 410, y: 34},	// map018.png
			{x: 116, y: 287},
			{x: 198, y: 539},
			{x: 619, y: 791},
			{x: 201, y: 1379},
			{x: 53, y: 1970},
			{x: 222, y: 2308},
			{x: 348, y: 2475}],
		
		[	{x: 304, y: 31},	// map019.png
			{x: 435, y: 118},
			{x: 478, y: 369},
			{x: 337, y: 455},
			{x: 267, y: 538},
			{x: 231, y: 624},
			{x: 516, y: 961},
			{x: 426, y: 1295},
			{x: 512, y: 1548},
			{x: 405, y: 1802},
			{x: 300, y: 1887},
			{x: 222, y: 2055}],
		
		[	{x: 367, y: 285},	// map020.png
			{x: 348, y: 370},
			{x: 515, y: 453},
			{x: 663, y: 792},
			{x: 264, y: 875},
			{x: 243, y: 1212},
			{x: 53, y: 1293},
			{x: 600, y: 1381},
			{x: 221, y: 1551},
			{x: 223, y: 1632},
			{x: 495, y: 1718},
			{x: 537, y: 1802},
			{x: 474, y: 1886},
			{x: 369, y: 2054},
			{x: 347, y: 2139},
			{x: 367, y: 2221},
			{x: 346, y: 2306}]
	],

	fuelData: [
		[	{x: 427, y: 184},	// map001.png
			{x: 385, y: 1026},
			{x: 463, y: 1446},
			{x: 290, y: 1616},
			{x: 411, y: 1784},
			{x: 485, y: 2120},
			{x: 385, y: 2205},
			{x: 437, y: 2364}],
			
		[	{x: 573, y: 100},	// map002.png
			{x: 636, y: 436},
			{x: 131, y: 774},
			{x: 637, y: 941},
			{x: 253, y: 1362},
			{x: 258, y: 1699},
			{x: 594, y: 1869},
			{x: 469, y: 2120}],
				
		[	{x: 469, y: 183},	// map003.png
			{x: 347, y: 268},
			{x: 289, y: 352},
			{x: 400, y: 688},
			{x: 443, y: 858},
			{x: 337, y: 942},
			{x: 258, y: 1110},
			{x: 421, y: 1868}],
				
		[	{x: 590, y: 268},	// map004.png
			{x: 153, y: 520},
			{x: 85, y: 604},
			{x: 574, y: 689},
			{x: 148, y: 857},
			{x: 464, y: 1025},
			{x: 132, y: 1279},
			{x: 469, y: 2289},
			{x: 511, y: 2457}],
				
		[	{x: 516, y: 1022},	// map005.png
			{x: 352, y: 1447},
			{x: 264, y: 1869}],
				
		[	{x: 58, y: 353},	// map006.png
			{x: 58, y: 436},
			{x: 58, y: 521},
			{x: 158, y: 1112},
			{x: 669, y: 1278},
			{x: 100, y: 2119},
			{x: 669, y: 2289}],
				
		[	{x: 274, y: 185},	// map007.png
			{x: 216, y: 352},
			{x: 310, y: 1363}],
				
		[	{x: 58, y: 1615},	// map008.png
			{x: 58, y: 2118},
			{x: 58, y: 2203},
			{x: 53, y: 2286}],
				
		[	{x: 416, y: 15},	// map009.png
			{x: 516, y: 689},
			{x: 458, y: 1110},
			{x: 431, y: 1277},
			{x: 316, y: 1363},
			{x: 257, y: 1447},
			{x: 495, y: 1783},
			{x: 274, y: 1952},
			{x: 236, y: 2037},
			{x: 217, y: 2119}],
				
		[	{x: 516, y: 604},	// map010.png
			{x: 57, y: 942},
			{x: 664, y: 1026},
			{x: 121, y: 1784},
			{x: 669, y: 1952}],
				
		[	{x: 415, y: 15},	// map011.png
			{x: 346, y: 437},
			{x: 285, y: 857},
			{x: 299, y: 1868},
			{x: 463, y: 2120}],
				
		[	{x: 178, y: 100},	// map012.png
			{x: 179, y: 183},
			{x: 374, y: 1952}],
				
		[	{x: 495, y: 100},	// map013.png
			{x: 348, y: 184},
			{x: 332, y: 522},
			{x: 416, y: 858},
			{x: 306, y: 943},
			{x: 394, y: 1108},
			{x: 416, y: 1275},
			{x: 337, y: 1616},
			{x: 369, y: 2036},
			{x: 474, y: 2290},
			{x: 337, y: 2373}],
				
		[	{x: 305, y: 15},	// map014.png
			{x: 563, y: 183},
			{x: 665, y: 1612},
			{x: 669, y: 2458}],
				
		[	{x: 352, y: 1110},	// map015.pnfg
			{x: 432, y: 1532},
			{x: 427, y: 1696},
			{x: 422, y: 1864},
			{x: 353, y: 2290}],
				
		[	{x: 348, y: 184},	// map016.png
			{x: 326, y: 773},
			{x: 184, y: 1447},
			{x: 668, y: 1953}],
				
		[	{x: 473, y: 352},	// map017.png
			{x: 427, y: 941},
			{x: 310, y: 1026},
			{x: 227, y: 1194}],
				
		[	{x: 52, y: 605},	// map018.png
			{x: 627, y: 689},
			{x: 374, y: 1111},
			{x: 199, y: 1277},
			{x: 248, y: 1869},
			{x: 627, y: 2036}],
				
		[	{x: 447, y: 1110},	// map019.png
			{x: 248, y: 1952}],
				
		[	{x: 453, y: 941},	// map020.png
			{x: 373, y: 2373}]
				
	],

	houseData: [
		[	{x: 591, y:  275, img: "L"},	//idx 0 level 1->terrain/islands repeat->lvl001.png
			{x: 631, y:  528, img: "R"},	// 10x
			{x: 609, y:  697, img: "L"},
			{x: 64,  y:  781, img: "L"},
			{x: 606, y:  865, img: "R"},
			{x: 627, y: 1370, img: "R"},
			{x: 585, y: 1876, img: "L"},
			{x:  47, y: 1960, img: "L"},
			{x: 600, y: 2044, img: "R"},
			{x:  52, y: 2542, img: "R"}],

		[	{x:  12, y:  189, img: "L"},	//idx 1 level 2->lvl002.png
			{x: 330, y:  610, img: "L"},	// 8x
			{x: 330, y:  696, img: "R"},
			{x: 710, y: 1032, img: "L"},
			{x:   9, y: 1117, img: "R"},
			{x:   0, y: 1959, img: "L"},
			{x: 633, y: 2381, img: "R"},
			{x: 611, y: 2550, img: "R"}],

		[	{x: 633, y:  107, img: "R"},	//idx 2 level 3->terrain repeat->lvl001.png
			{x:  11, y:  611, img: "R"},	// 6x
			{x:  53, y: 2045, img: "L"},
			{x: 648, y: 2297, img: "L"},
			{x: 653, y: 2381, img: "L"},
			{x: 658, y: 2549, img: "R"}],

		[	{x: 717, y:  108, img: "L"},	//idx 3 level 4->lvl003.png
			{x: 717, y:  192, img: "R"},	// 10x
			{x: 337, y: 1119, img: "L"},
			{x: 711, y: 1539, img: "R"},
			{x:  10, y: 1707, img: "R"},
			{x:  27, y: 1959, img: "R"},
			{x: 607, y: 2128, img: "L"},
			{x: 610, y: 2213, img: "R"},
			{x: 633, y: 2381, img: "R"},
			{x: 628, y: 2548, img: "L"}],

		[	{x: 643, y:  697, img: "L"},	//idx 4 level 5->terrain repeat->lvl001.png
			{x: 658, y:  949, img: "R"},	// 6x
			{x: 669, y: 1115, img: "L"},
			{x:  90, y: 1539, img: "L"},
			{x:  53, y: 2466, img: "L"},
			{x: 595, y: 2549, img: "R"}],

		[	{x: 711, y:   23, img: "L"},	//idx 5 level 6->lvl004.png
			{x: 716, y:  193, img: "L"},	// 9x
			{x:   0, y:  865, img: "R"},
			{x: 716, y: 1369, img: "L"},
			{x: 333, y: 1453, img: "L"},
			{x: 333, y: 1536, img: "R"},
			{x: 333, y: 1708, img: "L"},
			{x: 333, y: 1792, img: "R"},
			{x:   0, y: 2551, img: "L"}],

		[	{x:   7, y:  527, img: "L"},	//idx 6 level 7->terrain repeat->lvl001.png
			{x: 580, y:  610, img: "R"},	// 7x
			{x: 644, y:  779, img: "L"},
			{x:  79, y:  863, img: "R"},
			{x: 607, y: 2379, img: "L"},
			{x: 632, y: 2463, img: "R"},
			{x: 648, y: 2547, img: "L"}],

		[	{x: 333, y:  946, img: "R"},	//idx 7 level 8->lvl005.png
			{x: 333, y: 1453, img: "L"},	// 5x
			{x: 333, y: 1537, img: "R"},
			{x: 333, y: 2039, img: "R"},
			{x:  11, y: 2548, img: "L"}],

		[	{x: 596, y:  105, img: "L"},	//idx 8 level 9->terrain repeat->lvl001.png
			{x: 633, y:  358, img: "L"},	// 8x
			{x: 652, y:  526, img: "L"},
			{x: 657, y:  610, img: "R"},
			{x: 622, y: 1199, img: "R"},
			{x: 585, y: 1705, img: "R"},
			{x:   6, y: 2379, img: "R"},
			{x: 623, y: 2547, img: "L"}],

		[	{x: 333, y:  276, img: "L"},	//idx 9 level 10->lvl006.png
			{x: 333, y:  529, img: "R"},	// 6x
			{x: 333, y:  781, img: "L"},
			{x: 333, y: 1119, img: "L"},
			{x: 333, y: 1203, img: "R"},
			{x: 570, y: 2550, img: "L"}],
		
		[	{x:  40, y:  107, img: "L"},	//idx 10 level 11->terrain repeat->lvl001.png
			{x:  20, y:  192, img: "L"},	// 8x
			{x:  25, y: 1034, img: "L"},
			{x:  13, y: 1118, img: "R"},
			{x:  67, y: 1371, img: "L"},
			{x:  24, y: 2044, img: "R"},
			{x: 608, y: 2381, img: "R"},
			{x: 646, y: 2550, img: "R"}],

		[	{x: 570, y: 1363, img: "L"},	//idx 11 level 12->lvl007.png
			{x: 549, y: 1448, img: "L"},	// 6x
			{x: 549, y: 1867, img: "R"},
			{x: 27, y: 2372, img: "L"},
			{x: 74, y: 2457, img: "R"},
			{x: 74, y: 2541, img: "R"}],

		[	{x: 43, y: 351, img: "R"},		//idx 12 level 13->terrain repeat->lvl001.png
			{x: 58, y: 1023, img: "R"},		// 7x
			{x: 12, y: 1952, img: "R"},
			{x: 579, y: 2119, img: "L"},
			{x: 49, y: 2205, img: "R"},
			{x: 74, y: 2458, img: "L"},
			{x: 38, y: 2542, img: "R"}],

		[	{x: 333, y: 1026, img: "L"},	//idx 13 level 14->lvl008.png
			{x: 333, y: 1195, img: "L"},	// 6x
			{x: 333, y: 1279, img: "L"},
			{x: 333, y: 1699, img: "R"},
			{x: 333, y: 2121, img: "L"},
			{x: 712, y: 2541, img: "L"}],

		[	{x: 591, y: 358, img: "L"},		//idx 14 level 15->terrain repeat->lvl001.png
			{x: 657, y: 778, img: "L"},		// 7x
			{x: 617, y: 947, img: "R"},
			{x: 607, y: 1956, img: "L"},
			{x: 59, y: 2042, img: "L"},
			{x: 606, y: 2126, img: "R"},
			{x: 595, y: 2548, img: "R"}],

		[	{x: 548, y: 100, img: "R"},		//idx 15 level 16->lvl009.png
			{x: 654, y: 690, img: "R"},		// 7x
			{x: 332, y: 1110, img: "L"},
			{x: 332, y: 1195, img: "R"},
			{x: 332, y: 1364, img: "R"},
			{x: 712, y: 2034, img: "R"},
			{x: 75, y: 2542, img: "L"}],

		[	{x: 591, y:  183, img: "L"},	//idx 16 level 17->terrain repeat->lvl001.png
			{x:  53, y:  268, img: "R"},	// 9x
			{x: 632, y:  436, img: "L"},
			{x:  75, y:  521, img: "R"},
			{x: 638, y:  689, img: "R"},
			{x: 612, y:  858, img: "R"},
			{x: 601, y: 2205, img: "L"},
			{x: 649, y: 2374, img: "L"},
			{x: 659, y: 2541, img: "L"}],

		[	{x:   0, y:  868, img: "L"},	//idx 17 level 18->lvl010.png
			{x: 612, y:  953, img: "L"},	// 5x
			{x: 612, y: 1037, img: "R"},
			{x:  54, y: 1206, img: "R"},
			{x: 569, y: 2553, img: "R"}],

		[	{x: 623, y:  863, img: "R"},	//idx 18 level 19->terrain repeat->lvl001.png
			{x: 654, y: 1031, img: "R"},	// 6x
			{x: 617, y: 1199, img: "L"},
			{x: 622, y: 2294, img: "R"},
			{x: 653, y: 2463, img: "R"},
			{x:  85, y: 2547, img: "L"}],


		[	{x: 75, y:  184, img: "R"},		//idx 19 level 20->lvl011.png
			{x: 28, y:  522, img: "L"},		// 5x
			{x: 28, y:  605, img: "R"},
			{x: 96, y: 2458, img: "L"},
			{x: 96, y: 2543, img: "R"}]
	]
};
CC.yellow = CC.clr[1];
CC.ltgreen = CC.clr[2];
CC.waterblue = CC.clr[3];
CC.dkgreen = CC.clr[24];
CC.bgColor = CC.waterblue;
