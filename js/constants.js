"use strict";

/*
 0-null, 1-airplane, 2-bottom, 3-water, (4-propeller, 5-body, 6-middle), (7-cabin, 8-deck, 9-hull),
(10-base, 11-asphalt, (1-banner), (12-fuel, 13-white), 14-panel, (1)-letters, ((13-Wall),
 15-tree, 16-trunk), (17-support, 18-board1- 19-board2, (1-banner),(13-shot))
*/

//             0          1         2           3          4          5          6         7
let clr = ['#000000', '#E8E84A', '#6E9C42', '#2D32B8', '#D2A44A', '#004030', '#000089', '#000000',
    //         8          9          10        11         12         13          14        15   
           '#A33915', '#54A0C5', '#6F6F6F', '#AAAAAA', '#D65C5C', '#D6D6D6', '#8E8E8E', '#9ED065',
    //         16        17         18         19         20         21         22        23
           '#474700', '#7C2C00', '#86861D', '#69690F', '#BBBB35', '#75CCEB', '#75B5EF', '#355F18']

let KEY_P = 80;

let CC = {
	houseData: [
		{x: 643, y:  697, img: "left"},
		{x: 658, y:  949, img: "right"},
		{x: 669, y: 1115, img: "left"},
		{x:  90, y: 1539, img: "left"},
		{x:  53, y: 2466, img: "left"},
		{x: 595, y: 2549, img: "right"}
	]
};