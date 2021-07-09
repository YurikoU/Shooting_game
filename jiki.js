//Bullet class
class Bullet extends CharacterBase {
    constructor( x, y, vx, vy ) {
        super( 5, x, y, vx, vy );//Dispense the parameters to its parent class

        //this.w = 4;//Bullet width  : 4px
        //this.h = 6;//Bullet height : 6px
        this.r = 4;//Bullet radius: 4px
    };

    update() {
        super.update();//Inherit update() from its parent class

        //Check if the bullet is hit on the enemy as long as the enemies are still alive
        for( let i = 0; i < enemy.length;i++ ) {
            if ( !enemy[i].killItself ) {
                //Once enemy is killed, checkHit() returns true
                if ( checkHit(this.x, this.y, this.r, enemy[i].x, enemy[i].y, enemy[i].r) ) {
                    enemy[i].killItself = true;
                    this.killItself = true;
                    break;
                }
            }
        }
    };

    draw() {
        super.draw();//Inherit draw() from its parent class
    };
};//End of Bullet class


//Jiki class
class Jiki {
    //The start position is at the center of the field.
    constructor() {
        this.x = (FIELD_W/2)<<8;
        this.y = (FIELD_H/2)<<8;
        this.speed   = 512;
        this.anime   = 0;
        this.reload1 = 0;
        this.reload2 = 0;
    };

    //Move the sprite position by pressing an arrow key
    update() {
        //If the space key is pressed AND this.reload is 0, shoot a bullet
        if ( keyStatus['Space'] && this.reload1==0 ) {
            bullet.push( new Bullet(this.x+(0<<8), this.y-(10<<8), 0, -1300) );//Add a new instance of Bullet to the existing array object
            this.reload1 = 4;

            //If this.reload2 reaches 4, this.reload1 will be 20 to keep distance between bullets
            if( ++this.reload2 == 4 ) {
                this.reload1 = 20;
                this.reload2 = 0;
            }
        }

        //If the space key is released, this.reload1 and this.reload2 are back to 0
        if ( !keyStatus['Space'] ) {
            this.reload1 = this.reload2 = 0;
        }


        //If this.reload is more than 0, it's reduced so a bullet looks like a dot, not like a laser
        if ( 0 < this.reload1) {
            this.reload1--;
        }

        //Horizontal movement
        if ( keyStatus['ArrowLeft'] && this.speed<this.x ) {
            //Once "←" is pressed, move X to the left side by the sprite speed, leaning the sprite image to the left side
            this.x -= this.speed;
            if ( -8 < this.anime ) {
                this.anime--;//Sprite image will lean
            }
        } else if ( keyStatus['ArrowRight'] && this.x<=(FIELD_W<<8)-this.speed ) {
            //Once "→" is pressed, move X to the right side by the sprite speed, leaning the sprite image to the right side
            this.x += this.speed;
            if ( this.anime < 8 ) {
                this.anime++;//Sprite image will lean
            }
        } else {
            //If either is NOT pressed, the sprite image will be flat automatically
            if ( 0 < this.anime ) {
                this.anime--;
            }
            if ( this.anime < 0 ) {
                this.anime++;
            }
        }

        //Vertical movement
        if ( keyStatus['ArrowUp'] && this.speed<this.y ) {
            //Once "↑" is pressed, move Y to upward by the sprite speed
            this.y -= this.speed;
        } else if ( keyStatus['ArrowDown'] && this.y<=(FIELD_H<<8)-this.speed ) {
            //Once "↓" is pressed, move Y to downward by the sprite speed
            this.y += this.speed;
        }
    };

    //Draw a sprite that its index is 2, starting from (this.x, this.y)
    draw() {
        drawSprite(2 + (this.anime>>2), this.x, this.y);
    };
};//End of Juki class