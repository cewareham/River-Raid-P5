"use strict";

// background with vertical scroll
//*** VIP -> image height must be >= canvas height for vertical scrolling to work! ***
//*** POSITIVE speed values -> scroll from bottom to top
//*** NEGATIVE speed values -> scroll from top to bottom
class BackgroundVerticalScroll {
    constructor(imgArray, speed, minSpeed=1, maxSpeed=10) {
        this.imgArray = imgArray;
        this.img = imgArray[0];
        this.imgIndex = -1;
        this.negSpeed = false;
        if (speed <= 0) this.negSpeed = true;
        this.speed = Math.abs(speed);
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;

        this.top = height - this.img.height;		// set init scrollVal=theTop to show top of image @ top of canvas
        // NOTE: can't use top & bottom as they are window properties
        this.bottom = -this.img.height;
        this.scrollVal = 0;//this.bottom;		// initial scrollVal to show bottom of image @ bottom of canvas
        this.scrollHeight = 0;
        this.firstTime = true;
        this.index0 = this.index1 = 0;
        this.beenToTop = false;
        this.beenToBottom = false;
        this.prevSpeed = this.speed;
    }

    speedReversed() {
        return (this.prevSpeed > 0 && this.speed < 0) || (this.prevSpeed < 0 && this.speed > 0);
    }

    update() {
        if (this.negSpeed) this.scrollVal -= this.speed;
        else this.scrollVal += this.speed;

        if (keyIsDown(UP_ARROW)) {
            this.speed++;
            if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        } else if (keyIsDown(DOWN_ARROW)) {
            this.speed--;
            if (this.speed < this.minSpeed) this.speed = this.minSpeed;
        } else if (keyIsDown(KEY_P)) {     // KEY_P=80 in constants.js -> 'p' pressed -> pause
            this.speed = 0;
        }
    }

    // draw background scrolling vertically using translate(..)
    render() {
        console.log(this.scrollVal, this.index0, this.index1);
        
        //*** NOTE: works scrolling ALL top to bottom OR ALL bottom to top
        //  DOES NOT work correctly when changing directions
        if (this.speed > 0) {   //*** SCROLLING top to bottom
            if (this.scrollVal < this.top && !this.beenToTop) {
                this.beenToTop = true;
                this.beenToBottom = false;
                this.index1++;
                if (this.index1 > this.imgArray.length-1) this.index1 = 0;
                //if (Math.abs(this.index1 - this.index0) > 1) this.index0 = this.index1;
            }
            if (this.scrollVal < this.bottom & !this.beenToBottom) {
                this.beenToBottom = true;
                this.beenToTop = false;
                this.index0 = this.index1;
                //if (this.index0 > this.imgArray.length-1) this.index0 = 0;
            }
        } else {                //*** SCROLLING bottom to top
            if (this.scrollVal > 0 && !this.beenToTop) {
                this.beenToTop = true;
                this.beenToBottom = false;
                this.index1--;
                if (this.index1 < 0) this.index1 = this.imgArray.length-1;
                //if (Math.abs(this.index1 - this.index0) > 1) this.index0 = this.index1;
            }
            if (this.scrollVal > this.img.height && !this.beenToBottom) {
                this.beenToTop = false;
                this.beenToBottom = true;
                this.index0 = this.index1;
                //if (this.index0 < 0) this.index0 = this.imgArray.length-1;
            }
        }

        if (Math.abs(this.scrollVal) > this.img.height) {
            this.scrollVal = 0;
        } else {
            if (this.scrollVal < 0)
                this.scrollHeight = -this.img.height;
            else
                this.scrollHeight = this.img.height;
        }
        //ctx.save();
        //ctx.scale(3, 3);
        translate(0, height-this.img.height-this.scrollVal);
        image(this.imgArray[this.index0], 0, 0);
        image(this.imgArray[this.index1], 0, this.scrollHeight);
        //ctx.restore();
    }

}
