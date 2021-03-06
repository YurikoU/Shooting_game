//Start class
class Star {
    constructor() {
        //The coordinates of the star beginning
        this.x = rand(0, FIELD_W)<<8;
        this.y = rand(0, FIELD_H)<<8;

        //The vector of the X or Y axis direction 
        this.vectorX = 0;//NOT move horizontally
        this.vectorY = rand( 100, 300 );

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
        this.x += this.vectorX * starSpeed / 100;
        this.y += this.vectorY * starSpeed / 100;

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
    constructor( si, x, y, vx, vy ) {
        this.spriteIndex = si;
        this.x           = x;
        this.y           = y;
        this.vectorX     = vx;
        this.vectorY     = vy;
        this.killItself  = false;
        this.count       = 0;//Count how many times constructor() worked ot see each element's HP
    };

    //Move the bullet image by the vector 
    update() {
        this.count++;

        this.x += this.vectorX;
        this.y += this.vectorY;

        //If X or Y is beyond the field, delete will turn to true to delete Bullet object
        if (this.x+(100<<8) < 0 || (FIELD_W << 8) < this.x-(100<<8) || this.y+(100<<8) < 0 || (FIELD_H << 8) < this.y-(100<<8)) {
            this.killItself = true;
        }
    };

    //Draw a bullet
    draw() {
        drawSprite(this.spriteIndex, this.x, this.y);
    };

};//End of CharacterBase class


//Explosion class
class Explosion extends CharacterBase {
    constructor( c, x, y, vx, vy ) {
        super( 0, x, y, vx, vy );
        this.timer = c;
    };

    update() {
        if ( this.timer ) {//If timer is more than 0
            this.timer--;
            return;
        } 
        super.update();
    };

    draw() {
        if ( this.timer ) {//If timer is more than 0
            this.timer--;
            return;
        } 

        this.spriteIndex = 16 + (this.count>>2);
        if ( 27 <= this.spriteIndex  ) {//SpriteIndex of explosion images is between #16 and #26
            this.killItself = true;//Explosion will disappear
            return;
        } else {
            super.draw();
        }
    };
};//End of Explosion class


//Once a key is pressed, switch the status of JavaScript key code (US keyboards) to true
document.onkeydown = function (e) {
    keyStatus[e.code] = true;
    if ( gameOver  &&  e.code === 'KeyR' ) {
        delete jiki;
        jiki = new Jiki();
        gameOver = false;
        score    = 0;
    }
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


//Check if the bullet is hit on the enemy
// function checkHit( x1, y1, w1, h1,  x2, y2, w2, h2 ) {//Used for the hit box setup using rectangles
function checkHit( x1, y1, r1,  x2, y2, r2 ) {//Used for the hit box setup using circles
    //Hit box setup using circles
    let base          = (x2-x1)>>8;
    let perpendicular = (y2-y1)>>8;
    let hypotenuse    = r1 + r2;

    //Return TRUE or FALSE depends on if the bullet position rides on the enemy position using Pythagorean Theorem Formula
    return ( hypotenuse*hypotenuse >= base*base + perpendicular*perpendicular );

    /*
    //Hit box setup using rectangles
    let left1   = x1>>8;
    let right1  = left1 + w1;
    let top1    = y1>>8;
    let bottom1 = top1 + h1;

    let left2   = x2>>8;
    let right2  = left2 + w2;
    let top2    = y2>>8;
    let bottom2 = top2 + h2;

    //Return TRUE or FALSE depends on if the bullet position rides on the enemy position
    return (left2 <= right1 && 
        left1 <= right2 && 
        top1 <= bottom2 && 
        top2 <= bottom1 );
    */

};


//Display a massive explosion
function explode( x, y, vx, vy ) {
    explosion.push( 
        new Explosion( 0, x, y, vx, vy )
    );

    for ( let i = 0; i < 10; i++ ) {
        let explodeVectorX = vx + (rand(-10, 10)<<5);
        let explodeVectorY = vy + (rand(-10, 10)<<5);

        explosion.push( 
            new Explosion( i, x, y, explodeVectorX, explodeVectorY )
        );
    }

};