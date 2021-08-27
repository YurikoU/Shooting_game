// https://youtu.be/ZQYgH_JTyKU



//Flag for debugging
// const DEBUG = true;
const DEBUG = false;

let drawCount = 0;
let fps       = 0;
let lastTime  = Date.now();

//Game speed (ms) = 60 fps
const GAME_SPEED = 1000/60;

//Smoothing
const SMOOTHING = false;

//Screen size
const SCREEN_W = 320;
const SCREEN_H = 320;

//Canvas size (the same aspect ratio as the screen size)
const CANVAS_W = SCREEN_W * 2;
const CANVAS_H = SCREEN_H * 2;

//Field size
const FIELD_W = SCREEN_W + 120;
const FIELD_H = SCREEN_H + 40;

//Max number of stars
const STAR_MAX = 300;

//Canvas
let $canvas    = document.getElementById('can');
let context    = $canvas.getContext('2d');//Set the context as 2D
$canvas.width  = CANVAS_W;
$canvas.height = CANVAS_H;

//Scaled images are smoothed
context.mozimageSmoothingEnabled    = SMOOTHING;
context.webkitimageSmoothingEnabled = SMOOTHING;
context.msimageSmoothingEnabled     = SMOOTHING;
context.imageSmoothingEnabled       = SMOOTHING;

//Set the font size and family
context.font = "20px 'Impact'";

//Field (virtual canvas)
let $virtualCanvas    = document.createElement('canvas');
let virtualContext    = $virtualCanvas.getContext('2d');//Set the context as 2D
$virtualCanvas.width  = CANVAS_W;
$virtualCanvas.height = CANVAS_H;
virtualContext.font   = "12px 'Impact'";

//Coordinates of the camera
let camera_x = 0;
let camera_y = 0;

//Game over flag
let gameOver = false;
let score    = 0;

//Boss enemy's HP
let bossHp    = 0;
let bossMaxHp = 0;

//Star 
let star = [];

//Keyboard status
let keyStatus = [];

//Objects
let bullet      = [];
let enemy       = [];
let enemyBullet = [];
let explosion   = [];
let jiki        = new Jiki();


//Load the image file
let spriteImage = new Image();
spriteImage.src = "sprite.png";




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

        //If killItself is true (= X or Y is beyond the field), erase one array element (its index is #i)
        if ( obj[i].killItself ) {
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
    updateObj( enemyBullet );
    updateObj( enemy );
    updateObj( explosion );
    if ( !gameOver ) {
        jiki.update();//Update the sprite position
    }
};

//Draw all objects using drawObj() method
function drawAll() {
    //Reset the screen so a user can see a star as a dot. Otherwise, a star looks like a line.
    virtualContext.fillStyle = (jiki.damage) ? "red" : "black";//Screen color is red if jiki's damage is left. Otherwise, it's black.
    virtualContext.fillRect( camera_x, camera_y, SCREEN_W, SCREEN_H );   


    //Draw each object by substituting its object in drawObj() method
    drawObj( star );
    drawObj( bullet ); 
    if ( !gameOver ) {
        jiki.draw();//Draw a new sprite
    }    
    drawObj( enemy );
    drawObj( explosion );
    drawObj( enemyBullet );

    
    //Define the camera position so the sprite is always at the center of the camera
    //Sprite movement range; 0 to FIELD_W
    //Camera movement range; 0 to (FIELD_W - SCREEN_W)
    camera_x = Math.floor( (jiki.x>>8) / FIELD_W * (FIELD_W - SCREEN_W) );//Set the relative position to camera_x depends on jiki.x
    camera_y = Math.floor( (jiki.y>>8) / FIELD_H * (FIELD_H - SCREEN_H) );


    //Print the boss enemy's HP
    if ( 0 < bossHp ) {
        let size  = ( SCREEN_W - 20 ) * bossHp / bossMaxHp;
        let size2 = SCREEN_W - 20;
        virtualContext.fillStyle = "rgba(255, 0, 0, 0.5)";
        virtualContext.fillRect( camera_x+10, camera_y+10, size, 10 );
        virtualContext.strokeStyle = "rgba(255, 0, 0, 0.9)";
        virtualContext.strokeRect( camera_x+10, camera_y+10, size2, 10 );
    }

    
    //Print Jiki's HP
    if ( 0 < jiki.hp ) {
        let size  = ( SCREEN_W - 20 ) * jiki.hp / jiki.maxHp;
        let size2 = SCREEN_W - 20;
        virtualContext.fillStyle = "rgba(0, 0, 255, 0.5)";
        virtualContext.fillRect( camera_x+10, camera_y+SCREEN_H-14, size, 10 );
        virtualContext.strokeStyle = "rgba(0, 0, 255, 0.9)";
        virtualContext.strokeRect( camera_x+10, camera_y+SCREEN_H-14, size2, 10 );
    }

    //Print the score
    virtualContext.fillStyle = "white";
    virtualContext.fillText( "SCORE " + score, camera_x+10, camera_y+14 );


    //Copy drawing from the virtual screen to the actual screen
    context.drawImage( $virtualCanvas, camera_x, camera_y, SCREEN_W, SCREEN_H,
        0, 0, CANVAS_W, CANVAS_H );
};

function displayInfo () {
    context.fillStyle = "white";

    if ( gameOver ) {
        //Display the messages for the game over
        let s = " GAME OVER ";
        let w = context.measureText( s ).width; //The Width of the text
        let x = CANVAS_W/2 - w/2; //Message position on the X axis
        let y = CANVAS_H/2 - 20; //Message position on the Y axis
        context.fillText(s, x, y);

        s = " Press 'R' key to restart! ";
        w = context.measureText( s ).width; //The Width of the text
        x = CANVAS_W/2 - w/2; //Message position on the X axis
        y = CANVAS_H/2 - 20 + 20; //Message position on the Y axis
        context.fillText(s, x, y);
    }

    if ( DEBUG ) {
        drawCount++;
        if ( lastTime+1000 <= Date.now() ) { //Every second 
            fps       = drawCount;
            drawCount = 0;
            lastTime  = Date.now();
        }

        context.fillText( "FPS: " + fps, 20, 20 );//Print fps
        context.fillText( "Number of Bullets: " + bullet.length, 20, 40 );//Print the number of bullets
        context.fillText( "Number of Enemies: " + enemy.length, 20, 60 );//Print the number of enemies
        context.fillText( "Enemies' Bullets: " + enemyBullet.length, 20, 80 );//Print the number of enemies
        context.fillText( "Explosion: " + explosion.length, 20, 100 );//Print the number of enemies
        context.fillText( "X: " + (jiki.x>>8), 20, 120 );//Print the Jiki's position on the X-axis
        context.fillText( "Y: " + (jiki.y>>8), 20, 140 );//Print the Jiki's position on the Y-axis
        context.fillText( "HP: " + jiki.hp, 20, 160 );//Print the jiki's HP
        context.fillText( "SCORE: " + score, 20, 180 );//Print the jiki's score using the global variable "score"
        context.fillText( "COUNT: " + gameCount, 20, 200 );
        context.fillText( "WAVE: " + gameWave, 20, 220 );
    }
};


let gameCount = 0;
let gameWave  = 0;
let gameRound = 0;

let starSpeed        = 100;
let starSpeedRequest = 100;


//Repeat endlessly while playing
function gameLoop () {

    gameCount++;
    if ( starSpeed < starSpeedRequest ) {
        starSpeed++;
    } else if ( starSpeedRequest < starSpeed ) {
        starSpeed--;
    }

    if ( gameWave == 0 ) {
        if ( rand(0,15)==1 ) {
            enemy.push( new Enemy(0,  rand(0,FIELD_W)<<8,  0,  0,  rand(300,1200)) );
        }

        if ( (60*20) < gameCount ) { //After 20 seconds
            gameWave++;
            gameCount = 0;
            starSpeedRequest = 200;
        }
    } else if ( gameWave == 1 ) {
        if ( rand(0,15)==1 ) {
            enemy.push( new Enemy(1,  rand(0,FIELD_W)<<8,  0,  0,  rand(300,1200)) );
        }
        
        if ( (60*20) < gameCount ) { //After 20 seconds
            gameWave++;
            gameCount = 0;
            starSpeedRequest = 100;
        }
    } else if ( gameWave == 2 ) {
        if ( rand(0,10)==1 ) {
            let randomNum = rand(0, 1);
            enemy.push( new Enemy(randomNum,  rand(0,FIELD_W)<<8,  0,  0,  rand(300,1200)) );
        }
        
        if ( (60*20) < gameCount ) { //After 20 seconds
            gameWave++;
            gameCount = 0;
            enemy.push( new Enemy( 2, rand(0,FIELD_W/2)<<8,  -(70<<8),  0,  200 ) );//Display the boss enemy
            starSpeedRequest = 600;
        }
    } else if ( gameWave == 3 ) {
        if ( enemy.length == 0 ) { //After killing the enemy
            gameWave  = 0;
            gameCount = 0;
            gameRound++;
            starSpeedRequest = 100;
        }
    }

    

    updateAll();
    drawAll();
    displayInfo();
};


//Start the game once the page is loaded
window.onload = function() {
    gameInit();
    // enemy.push( new Enemy( 2, rand(0,FIELD_W/2)<<8,  0,  0,  200 ) );
};