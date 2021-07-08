//Start class
class Star {
    constructor() {
        //The coordinates of the star beginning
        this.x = rand(0, FIELD_W)<<8;
        this.y = rand(0, FIELD_H)<<8;

        //The vector of the X or Y axis direction 
        this.vectorX = 0;//NOT move horizontally
        this.vectorY = rand( 30, 200 );

        //Star size
        this.starSize = rand( 1, 2 );
    };

    draw() {
        let x = this.x>>8;
        let y = this.y>>8;
        //If x or y is out of the screen, don't draw
        if ( x < camera_x  ||  camera_x + SCREEN_W <= x  ||  y < camera_y  ||  camera_y + SCREEN_H <= y ) {
            return;
        }
        virtualContext.fillStyle = rand(0,2)!=0 ? '#66F' : '#aef'; //If rand(0, 2) is NOT 0, chose #66F. Otherwise, choose #8af.
        virtualContext.fillRect( this.x>>8, this.y>>8, this.starSize, this.starSize );
    };

    //X and Y coordinates will move by the vector
    update() {
        this.x += this.vectorX;
        this.y += this.vectorY;

        //If Y reach at the bottom of the field, Y is back to 0
        //X will be also a new random integer
        if ( FIELD_H<<8 < this.y ) {
            this.x = rand(0, FIELD_W)<<8;
            this.y = 0;
        }
    };
};//End Star class

//Declare a parent class
class CharacterBase {
    constructor(si, x, y, vx, vy) {
        this.spriteIndex = si;
        this.x = x;
        this.y = y;
        this.vectorX = vx;
        this.vectorY = vy;
        this.deleteBullet = false;
    };

    //Move the bullet image by the vector 
    update() {
        this.x += this.vectorX;
        this.y += this.vectorY;

        //If X or Y is beyond the field, deleteBullet will turn to true to delete Bullet object
        if (this.x < 0 || (FIELD_W << 8) < this.x || this.y < 0 || (FIELD_H << 8) < this.y) {
            this.deleteBullet = true;
        }
    };

    //Draw a bullet
    draw() {
        drawSprite(this.spriteIndex, this.x, this.y);
    };

};//End of CharacterBase class



//Once a key is pressed, switch the status of JavaScript key code (US keyboards) to true
document.onkeydown = function (e) {
    keyStatus[e.code] = true;
};

//Once a key is released, switch the status of JavaScript key code (US keyboards) to false
document.onkeyup = function (e) {
    keyStatus[e.code] = false;
};


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
    if ( px+spriteWidth < camera_x  ||  camera_x + SCREEN_W <= px  
        ||  py+spriteHeight < camera_y  ||  camera_y + SCREEN_H <= py ) 
    {
        return;
    }

    virtualContext.drawImage(spriteImage, spriteX, spriteY, spriteWidth, spriteHeight, 
        px, py, spriteWidth, spriteHeight);
};

//Return a random integer between the min and the max, and both numbers are inclusive
function rand( min, max ) {
    return Math.floor(Math.random() * (max-min+1)) + min;
};