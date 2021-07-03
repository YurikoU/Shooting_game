// https://youtu.be/ZQYgH_JTyKU


//Screen size
const SCREEN_W = 180;
const SCREEN_H = 320;

//Canvas size (the same aspect ratio as the screen size)
const CANVAS_W = SCREEN_W * 2;
const CANVAS_H = SCREEN_H * 2;

//Field size
const FIELD_W = SCREEN_W * 2;
const FIELD_H = SCREEN_H * 2;

//Max number of stars
const STAR_MAX = 300;


//Canvas
let $can = document.getElementById('can');
let con = $can.getContext('2d');
$can.width = CANVAS_W;
$can.height = CANVAS_H;


//Return a random integer between the min and the max, and both are inclusive
function rand(min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
}


class Star {
    constructor() {
        //The coordinates of the beginning
        this.x = rand(0, FIELD_W)<<8;
        this.y = rand(0, FIELD_H)<<8;

        //The vector of the X or Y axis direction 
        this.vectorX = 0;//NOT move horizontally
        this.vectorY = rand(30, 200);

        //Star size
        this.starSize = rand(1, 2);
    };

    draw() {
        con.fillStyle = rand(0,2)!= 0 ? '#66F' : '#8af'; //If rand(0, 2) is NOT 0, chose #66F. Otherwise, choose #8af.
        con.fillRect(this.x>>8, this.y>>8, this.starSize, this.starSize);
    };

    //X and Y coordinates will move by the vector
    update() {
        this.x += this.vectorX;
        this.y += this.vectorY;

        //If Y reach at the bottom of the field, Y is back to 0
        //X will be also a new random integer
        if (FIELD_H<<8 < this.y) {
            this.x = rand(0, FIELD_W)<<8;
            this.y = 0;
        }
    };
}



let star = [];
for (let i = 0; i < STAR_MAX; i++) {
    //Keep instantiating Star() until the max number of stars
    star[i] = new Star();
}  

//Reset the screen
con.fillStyle = "black";
con.fillRect(0, 0, SCREEN_W, SCREEN_H);

for (let i = 0; i < STAR_MAX; i++) {
    //Draw the new star until the max number of stars
    star[i].draw();
}