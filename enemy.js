class EnemyBullet extends CharacterBase {
    //EnemyBullet class only use the same methods and properties from CharacterBase class
};//End of EnemyBullet class


//Enemy class
class Enemy extends CharacterBase {
    constructor( si, x, y, vx, vy ) {
        super( si, x, y, vx, vy );//Dispense the parameters to its parent class
        this.flag = false;
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
            angleFromEnemyToJiki      += rand( -10, 10 ) * Math.PI / 180;
            let vectorXFromEnemyToJiki = Math.cos( angleFromEnemyToJiki ) * 1000;
            let vectorYFromEnemyToJiki = Math.sin( angleFromEnemyToJiki ) * 1000;


            enemyBullet.push( 
                new EnemyBullet( 15, this.x, this.y, vectorXFromEnemyToJiki, vectorYFromEnemyToJiki )
            );

            if ( -800 < this.vectorY ) {//The enemies will escape
                this.vectorY -= 30;
            }
        }
    };


    draw() {
        super.draw();//Inherit draw() from its parent class
    };


};//End of Enemy class