// https://youtu.be/ZQYgH_JTyKU



//Game speed (ms)
const GAME_SPEED = 1000/60;

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
let $canvas = document.getElementById('can');
let context = $canvas.getContext('2d');//Set the context as 2D
$canvas.width = CANVAS_W;
$canvas.height = CANVAS_H;

//Field (virtual canvas)
let $virtualCanvas = document.createElement('canvas');
let virtualContext = $virtualCanvas.getContext('2d');//Set the context as 2D
$virtualCanvas.width = CANVAS_W;
$virtualCanvas.height = CANVAS_H;

//Coordinates of the camera
let camera_x = 0;
let camera_y = 0;

//Star 
let star = [];

//Load the image file
let spriteImage = new Image();
spriteImage.src = "sprite.png";

//Declare a class for the sprite image
class Sprite {
    constructor( x, y, width, height ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
};

//Size of each sprite image (px)
let sprite = [
    new Sprite(  0, 0, 22, 42),//The 1st sprite from sprite.png is from (0,0)   and width: 22px, height: 42px
    new Sprite( 23, 0, 33, 42),//The 2nd sprite from sprite.png is from (23,0)  and width: 33px, height: 42px
    new Sprite( 57, 0, 43, 42),//The 3rd sprite from sprite.png is from (57,0)  and width: 43px, height: 42px
    new Sprite(101, 0, 33, 42),//The 4th sprite from sprite.png is from (101,0) and width: 33px, height: 42px
    new Sprite(135, 0, 21, 42) //The 5th sprite from sprite.png is from (135,0) and width: 21px, height: 42px
];

//Draw a sprite image
function drawSprite ( spriteIndex, x, y ) {
    let spriteX = sprite[spriteIndex].x;
    let spriteY = sprite[spriteIndex].y;
    let spriteWidth = sprite[spriteIndex].width;
    let spriteHeight = sprite[spriteIndex].height;

    //Get the center of sprites to be at (0, 0), when it's ordered.
    let px = (x>>8) - spriteWidth/2;
    let py = (y>>8) - spriteHeight/2;

    //If x or y is out of the screen, don't draw
    if ( px+spriteWidth/2 < camera_x  ||  camera_x + SCREEN_W <= px-spriteWidth/2  
        ||  py+spriteHeight/2 < camera_y  ||  camera_y + SCREEN_H <= py-spriteHeight/2 ) 
    {
        return;
    }


    virtualContext.drawImage(spriteImage, spriteX, spriteY, spriteWidth, spriteHeight, 
        px, py, spriteWidth, spriteHeight);
};


//Return a random integer between the min and the max, and both numbers are inclusive
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
        let x = this.x>>8;
        let y = this.y>>8;
        //If x or y is out of the screen, don't draw
        if ( x < camera_x  ||  camera_x + SCREEN_W <= x  ||  y < camera_y  ||  camera_y + SCREEN_H <= y ) {
            return;
        }
        virtualContext.fillStyle = rand(0,2)!= 0 ? '#66F' : '#8af'; //If rand(0, 2) is NOT 0, chose #66F. Otherwise, choose #8af.
        virtualContext.fillRect(this.x>>8, this.y>>8, this.starSize, this.starSize);
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



//Initialize the game settings
function gameInit() {
    //Keep instantiating Star() until the max number of stars
    for (let i = 0; i < STAR_MAX; i++) {
        star[i] = new Star();
    }  
    
    //Get gameLoop() work every the certain millisecond
    setInterval(gameLoop, GAME_SPEED);
}


function gameLoop () {
    //Stars will keep moving based on update();
    for (let i = 0; i < STAR_MAX; i++) {
        star[i].update();
    }
    
    //Reset the screen so a user can see a star as a dot. Otherwise, a star looks like a line.
    virtualContext.fillStyle = "black";
    virtualContext.fillRect(0, 0, SCREEN_W, SCREEN_H);
    
    //Draw the new star again until the max number of stars
    for (let i = 0; i < STAR_MAX; i++) {
        star[i].draw();
    }

    //Draw a sprite that its index is 2, starting from (100<<8, 100<<8)
    drawSprite(2, 100<<8, 100<<8);


    //Copy drawing from the virtual screen to the actual screen
    context.drawImage($virtualCanvas, camera_x, camera_y, SCREEN_W, SCREEN_H,
        0, 0, CANVAS_W, CANVAS_H);
}


//Start the game once the page is loaded
window.onload = function() {
    gameInit();
}