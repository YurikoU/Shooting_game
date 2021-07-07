// https://youtu.be/ZQYgH_JTyKU



// IIFE, Immediately Invoked Function Expression, to prevent from polluting the global scope.
(()=> {

    //Flag for debugging
    const DEBUG = true;

    let drawCount = 0;
    let fps       = 0;
    let lastTime  = Date.now();

    //Game speed (ms) = 60 fps
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
    let $canvas    = document.getElementById('can');
    let context    = $canvas.getContext('2d');//Set the context as 2D
    $canvas.width  = CANVAS_W;
    $canvas.height = CANVAS_H;

    //Field (virtual canvas)
    let $virtualCanvas    = document.createElement('canvas');
    let virtualContext    = $virtualCanvas.getContext('2d');//Set the context as 2D
    $virtualCanvas.width  = CANVAS_W;
    $virtualCanvas.height = CANVAS_H;

    //Coordinates of the camera
    let camera_x = 0;
    let camera_y = 0;

    //Star 
    let star = [];

    //Keyboard status
    let keyStatus = [];

    //Once a key is pressed, switch the status of JavaScript key code (US keyboards) to true
    document.onkeydown = function( e ){
        keyStatus[ e.code ] = true;
    };

    //Once a key is released, switch the status of JavaScript key code (US keyboards) to false
    document.onkeyup = function(e){
        keyStatus[ e.code ] = false;
    };

    //Declare a parent class
    class CharacterBase {
        constructor( si, x, y, vx, vy ) {
            this.spriteIndex  = si;
            this.x            = x;
            this.y            = y;
            this.vectorX      = vx;
            this.vectorY      = vy;
            this.deleteBullet = false;
        };

        //Move the bullet image by the vector 
        update() {
            this.x += this.vectorX;
            this.y += this.vectorY;

            //If X or Y is beyond the field, deleteBullet will turn to true to delete Bullet object
            if (this.x < 0 || (FIELD_W<<8) < this.x || this.y < 0 || (FIELD_H<<8) < this.y) {
                this.deleteBullet = true;
            }
        };

        //Draw a bullet
        draw() {
            drawSprite(this.spriteIndex, this.x, this.y);
        };

    };


    class Enemy extends CharacterBase {
        constructor( si, x, y, vx, vy ) {
            super( si, x, y, vx, vy );//Dispense the parameters to its parent class
        };

        update() {
            super.update();//Inherit update() from its parent class
        };

        draw() {
            super.draw();//Inherit draw() from its parent class
        };
    };//End of the class, Enemy
    let enemy = [
        new Enemy( 38, 200<<8, 200<<8, 0, 0 )
    ];


    class Bullet extends CharacterBase {
        constructor( x, y, vx, vy ) {
            super( 5, x, y, vx, vy );//Dispense the parameters to its parent class
        };

        update() {
            super.update();//Inherit update() from its parent class
        };

        draw() {
            super.draw();//Inherit draw() from its parent class
        };

    };//End of the class, Bullet
    let bullet = [];


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
                bullet.push( new Bullet(this.x, this.y, 0, -2000) );//Add a new instance of Bullet to the existing array object
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
    };//End of the class, Juki
    let jiki = new Jiki();


    //Load the image file
    let spriteImage = new Image();
    spriteImage.src = "sprite.png";

    //Declare a class for the sprite image
    class Sprite {
        constructor( x, y, w, h ) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        };
    };//End of the class, Sprite

    //Size of each sprite image (px), an array of instances
    let sprite = [
        //Sprites
        new Sprite(  0, 0, 22, 42),//#0 sprite from sprite.png,   (0,0), width:22px, height:42px, most leant to left
        new Sprite( 23, 0, 33, 42),//#1 sprite from sprite.png,  (23,0), width:33px, height:42px, leant to left
        new Sprite( 57, 0, 43, 42),//#2 sprite from sprite.png,  (57,0), width:43px, height:42px, flat
        new Sprite(101, 0, 33, 42),//#3 sprite from sprite.png, (101,0), width:33px, height:42px, leant to right
        new Sprite(135, 0, 21, 42),//#4 sprite from sprite.png, (135,0), width:21px, height:42px, most leant to right

        //Bullets
        new Sprite(  0, 50, 3, 7), //#5 image from sprite.png,   (0,50),  width:3px,  height:7px, bullet 1
        new Sprite(  4, 50, 5, 5), //#6 image from sprite.png,   (4,50),  width:5px,  height:5px, bullet 2

        new Sprite(  3,42,16, 5 ),// 7,噴射 左2
        new Sprite( 29,42,21, 5 ),// 8,噴射 左1
        new Sprite( 69,42,19, 5 ),// 9,噴射 正面
        new Sprite(108,42,21, 5 ),//10,噴射 右1
        new Sprite(138,42,16, 5 ),//11,噴射 右2
        
        new Sprite( 11,50, 7, 7 ),//12,敵弾1-1
        new Sprite( 19,50, 7, 7 ),//13,敵弾1-2
        new Sprite( 32,49, 8, 8 ),//14,敵弾2-1
        new Sprite( 42,47,12,12 ),//15,敵弾2-2
        
        new Sprite(  5,351, 9, 9),//16  ,爆発1
        new Sprite( 21,346,20,20),//17  ,爆発2
        new Sprite( 46,343,29,27),//18  ,爆発3
        new Sprite( 80,343,33,30),//19  ,爆発4
        new Sprite(117,340,36,33),//20  ,爆発5
        new Sprite(153,340,37,33),//21  ,爆発6
        new Sprite(191,341,25,31),//22  ,爆発7
        new Sprite(216,349,19,16),//23  ,爆発8
        new Sprite(241,350,15,14),//24  ,爆発9
        new Sprite(259,350,14,13),//25  ,爆発10
        new Sprite(276,351,13,12),//26  ,爆発11
        
        new Sprite(  6,373, 9, 9),//27  ,ヒット1
        new Sprite( 19,371,16,15),//28  ,ヒット2
        new Sprite( 38,373,11,12),//29  ,ヒット3
        new Sprite( 54,372,17,17),//30  ,ヒット4
        new Sprite( 75,374,13,14),//31  ,ヒット5
        
        new Sprite(  4,62,24,27),	//32  ,黄色1
        new Sprite( 36,62,24,27),	//33  ,黄色2
        new Sprite( 68,62,24,27),	//34  ,黄色3
        new Sprite(100,62,24,27),	//35  ,黄色4
        new Sprite(133,62,24,27),	//36  ,黄色5
        new Sprite(161,62,30,27),	//37  ,黄色6
        
        new Sprite(  4,95,24,26),	//38  ,ピンク1
        new Sprite( 36,95,24,26),	//39  ,ピンク2
        new Sprite( 68,95,24,26),	//40  ,ピンク3
        new Sprite(100,95,24,26),	//41  ,ピンク4
        new Sprite(133,92,24,29),	//42  ,ピンク5
        new Sprite(161,95,30,26),	//43  ,ピンク6
        
        new Sprite(  4,125,24,29),	//44  ,青グラサン1
        new Sprite( 36,125,24,29),	//45  ,青グラサン2
        new Sprite( 68,125,24,29),	//46  ,青グラサン3
        new Sprite(100,125,24,29),	//47  ,青グラサン4
        new Sprite(133,124,24,30),	//48  ,青グラサン5
        new Sprite(161,125,30,29),	//49  ,青グラサン6
        
        new Sprite(  4,160,25,27),	//50  ,ロボ1
        new Sprite( 34,160,26,27),	//51  ,ロボ2
        new Sprite( 66,160,26,27),	//52  ,ロボ3
        new Sprite( 98,160,26,27),	//53  ,ロボ4
        new Sprite(132,160,26,27),	//54  ,ロボ5
        new Sprite(161,158,30,29),	//55  ,ロボ6
        
        new Sprite(  4,194,24,28),	//56  ,にわとり1
        new Sprite( 36,194,24,28),	//57  ,にわとり2
        new Sprite( 68,194,24,28),	//58  ,にわとり3
        new Sprite(100,194,24,28),	//59  ,にわとり4
        new Sprite(133,194,24,30),	//60  ,にわとり5
        new Sprite(161,194,30,28),	//61  ,にわとり6
        
        new Sprite(  4,230,22,26),	//62  ,たまご1
        new Sprite( 41,230,22,26),	//63  ,たまご2
        new Sprite( 73,230,22,26),	//64  ,たまご3
        new Sprite(105,230,22,26),	//65  ,たまご4
        new Sprite(137,230,22,26),	//66  ,たまご5
        
        new Sprite(  6,261,24,28),	//67  ,殻帽ヒヨコ1
        new Sprite( 38,261,24,28),	//68  ,殻帽ヒヨコ2
        new Sprite( 70,261,24,28),	//69  ,殻帽ヒヨコ3
        new Sprite(102,261,24,28),	//70  ,殻帽ヒヨコ4
        new Sprite(135,261,24,28),	//71  ,殻帽ヒヨコ5
        
        new Sprite(206, 58,69,73),	//72  ,黄色(中)
        new Sprite(204,134,69,73),	//73  ,ピンク(中)
        new Sprite(205,212,69,78),	//74  ,青グラサン(中)
        
        new Sprite(337,  0,139,147),//75  ,黄色(大)
        new Sprite(336,151,139,147),//76  ,ピンク(大)
        new Sprite(336,301,139,155),//77  ,青グラサン()
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
            virtualContext.fillStyle = rand(0,2)!=0 ? '#66F' : '#8af'; //If rand(0, 2) is NOT 0, chose #66F. Otherwise, choose #8af.
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
    };//End of the class, Star



    //Initialize the game settings
    function gameInit() {
        //Keep instantiating Star() until the max number of stars
        for ( let i = 0; i < STAR_MAX; i++ ) {
            star[i] = new Star();
        }  
        
        //Get gameLoop() work every the certain millisecond
        setInterval( gameLoop, GAME_SPEED );
    };

    //Update an object (call by reference) 
    function updateObj ( obj ) {
        //Draw a new object depend on the number of pressed keys
        for ( let i=(obj.length-1); 0 <= i; i-- ) {
            obj[i].update();

            //If deleteBullet is true (= X or Y is beyond the field), erase one array element (its index is #i)
            if ( obj[i].deleteBullet ) {
                obj.splice( i, 1 );
            }
        }
    };

    //Draw an object (call by reference)
    function drawObj ( obj ) {
        //Draw a new object depend on the number of pressed keys
        for ( let i = 0; i < obj.length; i++ ) {
            obj[i].draw();
        }
    };

    //Update all objects using updateObj() method
    function updateAll() {
        //Update each position by substituting its object in updateObj() method
        updateObj( star );
        updateObj( bullet );
        updateObj( enemy );
        //Update the sprite position
        jiki.update();
    };

    //Draw all objects using drawObj() method
    function drawAll() {
        //Reset the screen so a user can see a star as a dot. Otherwise, a star looks like a line.
        virtualContext.fillStyle = "black";
        virtualContext.fillRect( camera_x, camera_y, SCREEN_W, SCREEN_H );
        
        //Define the camera position so the sprite is always at the center of the camera
        //Sprite movement range; 0 to FIELD_W
        //Camera movement range; 0 to (FIELD_W - SCREEN_W)
        camera_x = (jiki.x>>8) / FIELD_W * (FIELD_W - SCREEN_W);//Set the relative position to camera_x depends on jiki.x
        camera_y = (jiki.y>>8) / FIELD_H * (FIELD_H - SCREEN_H);

        //Draw each object by substituting its object in drawObj() method
        drawObj( star );
        drawObj( bullet );
        drawObj( enemy );
        //Draw a new sprite
        jiki.draw();

        //Copy drawing from the virtual screen to the actual screen
        context.drawImage( $virtualCanvas, camera_x, camera_y, SCREEN_W, SCREEN_H,
            0, 0, CANVAS_W, CANVAS_H );
    };

    function displayInfo () {
        if ( DEBUG ) {
            drawCount++;
            if ( lastTime+1000 <= Date.now() ) { //Every second 
                fps       = drawCount;
                drawCount = 0;
                lastTime  = Date.now();
            }

            context.font = "20px 'Impact'";
            context.fillStyle = "white";
            context.fillText( "FPS: " + fps, 20, 20 );//Print fps
            context.fillText( "Number of Bullets: " + bullet.length, 20, 40 );//Print the number of bullets
            context.fillText( "Number of Enemies: " + enemy.length, 20, 60 );//Print the number of enemies
        }
    };


    //Repeat endlessly while playing
    function gameLoop () {
        updateAll();
        drawAll();
        displayInfo();
    };

    //Start the game once the page is loaded
    window.onload = function() {
        gameInit();
    };


})();//End of IIFE