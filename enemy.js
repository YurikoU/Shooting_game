class EnemyBullet extends CharacterBase {
    constructor( si, x, y, vx, vy, t ) {
        super( si, x, y, vx, vy );
        this.radius = 3;//Enemy's bullet radius: 4px
        if ( t == undefined ) {
            this.timer  = 0;
        } else {
            this.timer  = t;
        }
    };

    update() {
        if ( this.timer ) {
            this.timer--;
            return;
        }

        super.update();

        //Once the enemy's bullet hits jiki AND no damage is left AND it's not game over, checkHit() returns true
        if ( !gameOver && !jiki.unbeatableTime && checkHit(this.x, this.y, this.radius, jiki.x, jiki.y, jiki.radius) ) {
            this.killItself     = true;
            if ( (jiki.hp -= 30) <= 0 ) {
                gameOver = true;
            } else {
                jiki.damage         = 10;//Jiki will receive 10 of damage
                jiki.unbeatableTime = 60;//Jiki has unbeatable time and it won't get any damage
            }
        }

        //spriteIndex is 14 or 15
        this.spriteIndex = 14 + ((this.count>>3)&1);//(this.count&1) will return 0 or 1
    };
};//End of EnemyBullet class


//Enemy class
class Enemy extends CharacterBase {
    constructor( index, x, y, vx, vy ) {
        super( 0, x, y, vx, vy );//Dispense the parameters to its parent class
        this.enemyIndex = enemyMaster[index].num; //Declare a new variable to see the enemy index
        this.radius     = enemyMaster[index].radius; //Enemy radius
        this.maxHp      = enemyMaster[index].hp; 
        this.hp         = this.maxHp; 
        this.score      = enemyMaster[index].score;
        this.flag       = false;
        this.direction  = 90;
    };

    update() {
        //Common update() process
        super.update();//Inherit update() from its parent class

        if ( 1000 <= this.maxHp ) {
            bossHp    = this.hp;
            bossMaxHp = this.maxHp;
        }

        //Each enemy movement
        enemyFunctionArray[this.enemyIndex] ( this );
        

        //Hit box
        //Once the enemy directly confronts jiki AND no damage is left AND it's not game over, checkHit() returns true
        if ( !gameOver && !jiki.unbeatableTime && checkHit(this.x, this.y, this.radius, jiki.x, jiki.y, jiki.radius) ) {
            this.killItself     = true;
            if ( (jiki.hp -= 30) <= 0 ) {
                gameOver = true;
            } else {
                jiki.damage         = 10;//Jiki will receive 10 of damage
                jiki.unbeatableTime = 60;//Jiki has unbeatable time and it won't get any damage
            }
        }
    };

};//End of Enemy class


//Manage the speed of the enemies' shots and the angle toward
function enemyShot( obj, speed ) {

    if ( gameOver ) {
        return;
    }

    //Math.atan2        : 0 to 2 (radian)
    //Math.cos, Math.sin: 0 to 1
    let angleFromEnemyToJiki   = Math.atan2( (jiki.y - obj.y), (jiki.x - obj.x) );
    // angleFromEnemyToJiki      += rand( -3, 3 ) * Math.PI / 180; //Change the angle
    let vectorXFromEnemyToJiki = Math.cos( angleFromEnemyToJiki ) * speed;
    let vectorYFromEnemyToJiki = Math.sin( angleFromEnemyToJiki ) * speed;

    enemyBullet.push( 
        new EnemyBullet( 15, obj.x, obj.y, vectorXFromEnemyToJiki, vectorYFromEnemyToJiki )
    );
};


//Movement Pattern #01 (enemy: pink chick)
function enemyMove01( obj ) {

    if ( !obj.flag ) {
        //The enemy will approach to jiki, if the enemies are far from jiki
        if ( obj.x < jiki.x  &&  obj.vectorX < 120 ) {
            obj.vectorX += 4; 
        } else if ( jiki.x < obj.x  &&  -120 < obj.vectorX ) {
            obj.vectorX -= 4;
        }
    } else {
        //The enemies will escape, if the enemies are near jiki
        if ( jiki.x < obj.x  &&  obj.vectorX < 400 ) {
            obj.vectorX += 30; 
        } else if ( obj.x < jiki.x && -400 < obj.vectorX ) {
            obj.vectorX -= 30;
        }
    }
    
    if ( Math.abs(jiki.y - obj.y) < (100<<8)  &&  !obj.flag ) {//If the enemies come near to jiki within 100px
        obj.flag = true;
        enemyShot( obj, 600 );
        
    }

    if ( obj.flag  &&  -800 < obj.vectorY ) {//The enemies will escape, once they come to near the sprite
        obj.vectorY -= 30;
    }

    //Enemy image looks flapping
    const enemyPattern = [ 39, 40, 39, 41 ];
    obj.spriteIndex = enemyPattern[ (obj.count>>3) & 3 ];//"...&3" is same as "...%4"
};


//Movement Pattern #02 (enemy: yellow chick)
function enemyMove02( obj ) {

    if ( !obj.flag ) {
        //The enemy will approach to jiki, if the enemies are far from jiki
        if ( obj.x < jiki.x  &&  obj.vectorX < 600 ) {
            obj.vectorX += 30; 
        } else if ( jiki.x < obj.x  &&  -600 < obj.vectorX ) {
            obj.vectorX -= 30;
        }
    } else {
        //The enemies will escape, if the enemies are near jiki
        if ( jiki.x < obj.x  &&  obj.vectorX < 600 ) {
            obj.vectorX += 30; 
        } else if ( obj.x < jiki.x && -600 < obj.vectorX ) {
            obj.vectorX -= 30;
        }
    }
    
    if ( Math.abs(jiki.y - obj.y) < (100<<8)  &&  !obj.flag ) {//If the enemies come near to jiki within 100px
        obj.flag = true;
        enemyShot( obj, 600 );
    }
    
    
    // if ( obj.flag  && -800 < obj.vectorY ) {//The enemies will escape
    //     obj.vectorY -= 30;
    // }

    //Enemy image looks flapping
    const enemyPattern = [ 33, 34, 33, 35 ];
    obj.spriteIndex = enemyPattern[ (obj.count>>3) & 3 ];//"...&3" is same as "...%4"    
};

//Movement Pattern #03 (enemy: boss enemy)
function enemyMove03( obj ) {

    if ( !obj.flag  &&  60 <= (obj.y>>8) ) {
        obj.flag = 1;
    } 

    if ( obj.flag == 1 ) {
        if ( (obj.vectorY-=2) <= 0 ) {
            obj.flag    = 2;
            obj.vectorY = 0;
        }
    } else if ( obj.flag == 2 ) {
        if ( obj.vectorX < 300 ) {
            obj.vectorX += 10;
        }
        if ( (FIELD_W-100) < (obj.x>>8) ) {
            obj.flag    = 3;
        }
    } else if ( obj.flag == 3 ) { 
        if ( -300 < obj.vectorX ) {
            obj.vectorX -= 10;
        }
        if ( (obj.x>>8) < 100 ) {
            obj.flag    = 2;
        }
    }

    //Shoot a bullet
    if ( 1 < obj.flag ) {
        let angleFromEnemyToJiki   = obj.direction * Math.PI / 180;
        let vectorXFromEnemyToJiki = Math.cos( angleFromEnemyToJiki ) * 300;
        let vectorYFromEnemyToJiki = Math.sin( angleFromEnemyToJiki ) * 300;
        let vectorX2               = ( Math.cos( angleFromEnemyToJiki ) * 70 )<<8;
        let vectorY2               = ( Math.sin( angleFromEnemyToJiki ) * 70 )<<8;
        enemyBullet.push( 
            new EnemyBullet( 15, obj.x+vectorX2, obj.y+vectorY2, vectorXFromEnemyToJiki, vectorYFromEnemyToJiki, 60 )
        );
    
        if ( 360 <= (obj.direction+=12) ) {
            obj.direction = 0;
        }
    }

    //Additional hits
    if ( obj.hp < obj.maxHp/2 ) {
        let c = obj.count % (60 * 5); //60*5 == 5 seconds 
    }

    // //Enemy image looks flapping
    obj.spriteIndex = 75;
};


let enemyFunctionArray = [
    enemyMove01,
    enemyMove02,
    enemyMove03,
];