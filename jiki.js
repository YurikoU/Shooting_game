//Bullet class
class Bullet extends CharacterBase {
    constructor( x, y, vx, vy ) {
        super( 6, x, y, vx, vy );//Dispense the parameters to its parent class
        this.radius = 4;//Bullet radius: 4px
    };

    update() {
        super.update();//Inherit update() from its parent class

        //Check if the bullet is hit on the enemy as long as the enemies are still alive
        for( let i = 0; i < enemy.length;i++ ) {
            if ( !enemy[i].killItself ) {
                //Once enemy is killed, checkHit() returns true
                if ( checkHit(this.x, this.y, this.radius, enemy[i].x, enemy[i].y, enemy[i].radius) ) {
                    this.killItself = true;
                    //If the enemy's HP was less than 0, then delete the killed enemy
                    if ( (enemy[i].hp -= 10)  <=  0 ) {
                        enemy[i].killItself = true;
                        explode( enemy[i].x, enemy[i].y, enemy[i].vx>>3, enemy[i].vy>>3 );
                        score += enemy[i].score;
                    } else {
                        //If the attacked enemy is still alive, jiki will explode
                        explosion.push(new Explosion( 0, this.x, this.y, 0, 0 ));
                    }

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
        this.x     = (FIELD_W / 2)<<8;
        this.y     = (FIELD_H - 50)<<8;
        this.maxHp = 100;
        this.hp    = this.maxHp;
        
        this.speed          = 512;
        this.anime          = 0;
        this.reload1        = 0;
        this.reload2        = 0;
        this.radius         = 3;//Juki's radius: 10px
        this.damage         = 0;
        this.unbeatableTime = 0;//Jiki won't get any damage while unbeatableTime lasts
        this.count          = 0;
    };

    //Move the sprite position by pressing an arrow key
    update() {
        this.count++;

        //If damage is left, it will lessen by each frame
        if ( this.damage ) {
            this.damage--;
        }

        //If unbeatableTime is left, it will lessen by each frame
        if ( this.unbeatableTime ) {
            this.unbeatableTime--;
        }

        //If the space key is pressed AND this.reload is 0, shoot a bullet
        if ( keyStatus['Space'] && this.reload1==0 ) {
            //Add a new instance of Bullet to the existing array object
            bullet.push( new Bullet(this.x+(6<<8), this.y-(10<<8),    0, -2000) );
            bullet.push( new Bullet(this.x-(6<<8), this.y-(10<<8),    0, -2000) );
            bullet.push( new Bullet(this.x+(8<<8), this.y-( 5<<8),  200, -2000) );
            bullet.push( new Bullet(this.x-(8<<8), this.y-( 5<<8), -200, -2000) );
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
        //If unbeatableTime lasts  AND  count&1 is 0, which means, this.count is an even number
        if ( this.unbeatableTime && (this.count&1) ) {
            return;
        }
        drawSprite(2 + (this.anime>>2), this.x, this.y);//Sprite image

        //If count&1 is 0, which means, this.count is an even number
        if ( this.count & 1 ) {
            return;
        }
        drawSprite(9 + (this.anime>>2), this.x, this.y + (24<<8));//Jet image
    };
};//End of Juki class