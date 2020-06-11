"use strict";


// final name for game: #1-River Blitz, #2-River Assault or #3-Stream Attack

let CC = {
	collide: function(obj1, obj2) {
		return (obj1.x+obj1.w>obj2.x && obj1.x<obj2.x+obj2.w
			&& obj1.y+obj1.h>obj2.screenY && obj1.y<obj2.screenY+obj2.h);
	},

	KEY_P: 80,

	/*
	0-null, 1-airplane, 2-bottom, 3-water, (4-propeller, 5-body, 6-middle), (7-cabin, 8-deck, 9-hull),
	(10-base, 11-asphalt, (1-banner), (12-fuel, 13-white), 14-panel, (1)-letters, ((13-Wall),
	15-tree, 16-trunk), (17-support, 18-board1- 19-board2, (1-banner),(13-shot))
	*/
	clr:
		//     0      1-yellow      2           3          4          5          6         7
		[  '#000000', '#E8E84A', '#6E9C42', '#2D32B8', '#D2A44A', '#004030', '#000089', '#000000',
    	//     8          9          10        11         12         13          14        15   
           '#A33915', '#54A0C5', '#6F6F6F', '#AAAAAA', '#D65C5C', '#D6D6D6', '#8E8E8E', '#9ED065',
    	//     16        17         18         19         20         21         22        23
           '#474700', '#7C2C00', '#86861D', '#69690F', '#BBBB35', '#75CCEB', '#75B5EF', '#355F18'],

	bridgeData: {x: 295, y: 2629},

    // indexes into shapes array - easier than using #s
    eShape: {
        PLANE: 0, PLANE_LEFT: 1, PLANE_RIGHT: 2, HELI_RIGHT0: 3, HELI_RIGHT1: 4,
        HELI_LEFT0: 5, HELI_LEFT1: 6, SHIP_RIGHT: 7, SHIP_LEFT: 8, AIRPLANE_E: 9,
        AIRPLANE_D: 10, FUEL: 11, EXPL1:12, EXPL2: 13, HOME: 14
    },

	plane:
	[
		[[0, 0, 0, 1, 0, 0, 0], // 0 plane -> array of color values
        [0, 0, 0, 1, 0, 0, 0],  //  indexed into clr array in color.js
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