class EnemyBullet extends CharacterBase {
    constructor( si, x, y, vx, vy ) {
        super( si, x, y, vx, vy );
        this.radius = 4;//Enemy's bullet radius: 4px
    };

    update() {
        super.update();

        //Once the enemy's bullet hits jiki AND no damage is left, checkHit() returns true
        if ( !jiki.damage && checkHit(this.x, this.y, this.radius, jiki.x, jiki.y, jiki.radius) ) {
            this.killItself = true;
            jiki.damage     = 10;//Jiki will receive 10 of damage
        }
    };
};//End of EnemyBullet class


//Enemy class
class Enemy extends CharacterBase {
    constructor( si, x, y, vx, vy ) {
        super( si, x, y, vx, vy );//Dispense the parameters to its parent class
        this.flag = false;

        //this.w = 20;//Enemy width  : 20px
        //this.h = 20;//Enemy height : 20px
        this.radius = 10;//Enemy radius: 10px
    };

    update() {
        super.update();//Inherit update() from its parent class

        //demo

        if ( !this.flag ) {
            //The enemy will approach to jiki, if the enemies are far from jiki
            if ( this.x < jiki.x  &&  this.vectorX < 120 ) {
                this.vectorX += 4; 
            } else if ( jiki.x < this.x  &&  -120 < this.vectorX ) {
                this.vectorX -= 4;
            }
        } else {
            //The enemies will escape, if the enemies are near jiki
            if ( jiki.x < this.x  &&  this.vectorX < 400 ) {
                this.vectorX += 30; 
            } else if ( this.x < jiki.x && -400 < this.vectorX ) {
                this.vectorX -= 30;
            }
        }
        
        if ( Math.abs(jiki.y - this.y) < (100<<8)  &&  !this.flag ) {//If the enemies come near to jiki within 100px
            this.flag = true;

            //Math.atan2        : 0 to 2 (radian)
            //Math.cos, Math.sin: 0 to 1
            let angleFromEnemyToJiki   = Math.atan2( (jiki.y - this.y), (jiki.x - this.x) );
            angleFromEnemyToJiki      += rand( -3, 3 ) * Math.PI / 180;
            let vectorXFromEnemyToJiki = Math.cos( angleFromEnemyToJiki ) * 1000;
            let vectorYFromEnemyToJiki = Math.sin( angleFromEnemyToJiki ) * 1000;


            enemyBullet.push( 
                new EnemyBullet( 15, this.x, this.y, vectorXFromEnemyToJiki, vectorYFromEnemyToJiki )
            );

            if ( -800 < this.vectorY ) {//The enemies will escape
                this.vectorY -= 30;
            }
            
        }

        //Once the enemy directly confronts jiki AND no damage is left, checkHit() returns true
        if ( !jiki.damage && checkHit(this.x, this.y, this.radius, jiki.x, jiki.y, jiki.radius) ) {
            this.killItself = true;
            jiki.damage     = 10;//Jiki will receive 10 of damage
        }
    };


    draw() {
        super.draw();//Inherit draw() from its parent class
    };


};//End of Enemy class