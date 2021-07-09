// https://youtu.be/ZQYgH_JTyKU



//Flag for debugging
const DEBUG = true;

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

//Objects
let bullet = [];
let enemy = [];
let enemyBullet = [];
let jiki = new Jiki();


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
    jiki.update();//Update the sprite position
    updateObj( enemyBullet );
    updateObj( enemy );
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
    jiki.draw();//Draw a new sprite
    drawObj( enemyBullet );
    drawObj( enemy );

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
        context.fillText( "Enemies' Bullets: " + enemyBullet.length, 20, 80 );//Print the number of enemies
    }
};


//Repeat endlessly while playing
function gameLoop () {

    //demo
    if ( rand(0,30)==1 ) {
        enemy.push( new Enemy(39,  rand(0,FIELD_W)<<8,  0,  0,  rand(300,1200)) );
    }

    updateAll();
    drawAll();
    displayInfo();
};

//Start the game once the page is loaded
window.onload = function() {
    gameInit();
};