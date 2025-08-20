var jumpSound;
var collectingSound;
var collectFlagSound;
var deathSound;
var enemyContactSound;
var gameOverSound;

var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var collectables;
var trees_x;
var clouds;
var mountains;
var canyons;
var cameraPosX;
var game_score;
var flagpole;
var lives;
var platforms;
var enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    collectingSound = loadSound('assets/collect.mp3');
    collectingSound.setVolume(0.8);
    
    collectFlagSound = loadSound('assets/collectflag.mp3');
    collectFlagSound.setVolume(0.8);
    
    deathSound = loadSound('assets/death.mp3');
    deathSound.setVolume(0.1);
    
    enemyContactSound = loadSound('assets/enemycontact.mp3');
    enemyContactSound.setVolume(0.8);
    
    gameOverSound = loadSound('assets/gameover.mp3');
    gameOverSound.setVolume(0.1);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	
    lives = 3;
    
    //startgame
    startGame();
    
}

function draw()
{
    // scrolling part
    cameraPosX = gameChar_x - 500;

	///////////DRAWING CODE//////////

    //fill the sky blue
	background(100,155,255); 

    //draw some green ground
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); 
    
    push();
    // scrolling part
    translate(-cameraPosX,0);
    
    //mountains
    drawMountains();
    
    //trees
    drawTrees();
    
    //clouds
    drawClouds();
    
    
    //canyon
    for(var i = 0; i<canyons.length; i++)
        {
          drawCanyon(canyons[i]);
          checkCanyon(canyons[i]);
        }
    
    
    //platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    
    //collectables
    for(var i = 0; i<collectables.length; i++)
        {
            if(!collectables[i].isFound)
                {
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]);
                }
        }
    
    //flagpole
    renderFlagpole();
    
    if(flagpole.isReached == false)
        {
            checkFlagpole();
        }
    
    for(var i = 0; i < enemies.length; i++)
        {
            enemies[i].draw();
            
            var isContact = enemies[i].checkContact(gameChar_x,gameChar_y);
            
            if(isContact && lives > 0)
                {
                    startGame();
                    enemyContactSound.play();
                }
        }
    
    //platforms 
    createPlatforms();
    
    //lives
    checkPlayerDie();
    
    //character
    drawCharacter();
    
    pop();
    
    //score on screen
    fill(255);
    noStroke();
    textSize(20);
    text("score : " + game_score,20,30);
    gameTokens();
    
    //lives on screen
    livesTokens();
    
    //gameover
    if(lives == 0)
        {
            fill("black");
            stroke("white");
            textSize(30);
            text("Game over. Press space to continue.",width/2 -230,height/2);
            gameOverSound.play();
            return;
        }
    
    //level completed
    if(flagpole.isReached == true && game_score == 2)
    {
        fill("black");
        stroke("white");
        textSize(30);
        text("Nice try, You collected 2/5. Level complete. Press space to continue.",width/2 -120,height/2-100,300,300);
        return;
    }
    
    if(flagpole.isReached == true && game_score == 3)
    {
        fill("black");
        stroke("white");
        textSize(30);
        text("Good job, You collected 3/5. Level complete. Press space to continue.",width/2 -120,height/2-100,300,300);
        return;
    }
    
    if(flagpole.isReached == true && game_score == 4)
    {
        fill("black");
        stroke("white");
        textSize(30);
        text("Great work, You collected 4/5. Level complete. Press space to continue.",width/2 -120,height/2-100,300,300);
        return;
    }
    
    if(flagpole.isReached == true && game_score == 5)
    {
        fill("black");
        stroke("white");
        textSize(30);
        text("Amazing, You collected 5/5. Level complete. Press space to continue.",width/2 -120,height/2-100,300,300);
        return;
    }

    
	///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here
    
    //move the character left
    if(isLeft == true)
    {
        if(isPlummeting == false)
        {
             gameChar_x -=3;
        }
    }
    
    //move the character left
    if(isRight ==true)
    {
        if(isPlummeting == false)
        {
             gameChar_x +=3;
        }
    }
    
    //jumping character
    if(gameChar_y < floorPos_y)
    {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
            {
                if(platforms[i].checkContact(gameChar_x,gameChar_y) == true)
                    {
                        isContact = true;
                        isFalling = false;
                        break;
                    }
            }
        if(isContact == false)
            {
                gameChar_y +=1;
                isFalling = true;
            }
    }
    else
    {
        isFalling = false;
    }
    
    //plummeting character
    if(isPlummeting == true)
    {
        gameChar_y += 3;
        deathSound.play();
    }
    

}


function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
    
    //move to the left
    if(keyCode == 37 || key == "a")
    {
        isLeft = true;
    }
    
    //move to the right
    if(keyCode == 39 || key == "d")
    {
        isRight = true;
    }
    
    //jump up
    if(keyCode == 38 || key == "w")
    {
        //prevent double jump
        if(gameChar_y==floorPos_y)
        {
            gameChar_y = gameChar_y-100;
            isFalling == true;
            jumpSound.play();
        }

    }
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
    
    //key released for left button
    if( keyCode == 37 || key == "a")
    {
        isLeft = false;
    }
    
    //key released for right button
    if( keyCode == 39 || key == "d")
    {
        isRight = false;
    }
}

function drawCharacter()
{
    //the game character
	if(isLeft && isFalling)
	{
    strokeWeight(1);
    stroke(120,120,120);
    fill(216,191,216);
    rect(gameChar_x,gameChar_y-40,10,30);
    fill(244,164,96);
    ellipse(gameChar_x+5,gameChar_y-50,20,20);
    fill("black");
    rect(gameChar_x-2,gameChar_y-45,3,1);
    fill(244,164,96);
    rect(gameChar_x+5,gameChar_y-60,5,28);
    fill("black");
    rect(gameChar_x+3,gameChar_y-9,12,5);
    fill("black");
    ellipse(gameChar_x,gameChar_y-50,5,5);
	}
	else if(isRight && isFalling)
	{
    strokeWeight(1);
    stroke(120,120,120);
    fill(244,164,96);
    rect(gameChar_x,gameChar_y-60,5,28);
    fill(244,164,96);
    ellipse(gameChar_x+5,gameChar_y-50,20,20);
    fill("black");
    rect(gameChar_x+9,gameChar_y-45,3,1);
    fill(216,191,216);
    rect(gameChar_x,gameChar_y-40,10,30);
    fill(244,164,96);
    rect(gameChar_x,gameChar_y-60,5,28);
    fill("black");
    rect(gameChar_x-4,gameChar_y-9,12,5);
    fill("black");
    ellipse(gameChar_x+13,gameChar_y-50,5,5);
	}
	else if(isLeft)
	{
    strokeWeight(1);
    stroke(120,120,120);
    fill(216,191,216);
    rect(gameChar_x,gameChar_y-40,10,30);
    fill(244,164,96);
    ellipse(gameChar_x+5,gameChar_y-50,20,20);
    fill("black");
    rect(gameChar_x-2,gameChar_y-45,3,1);
    fill("black");
    rect(gameChar_x+3,gameChar_y-10,5,10);
    fill(244,164,96);
    rect(gameChar_x+5,gameChar_y-25,5,10);
    fill("black");
    ellipse(gameChar_x,gameChar_y-50,5,5);
    }
	else if(isRight)
	{  
    strokeWeight(1);
    stroke(120,120,120);
    fill(216,191,216);
    rect(gameChar_x,gameChar_y-40,10,30);
    fill(244,164,96);
    ellipse(gameChar_x+5,gameChar_y-50,20,20);
    fill("black");
    rect(gameChar_x+9,gameChar_y-45,3,1);
    fill("black");
    rect(gameChar_x+3,gameChar_y-10,5,10);
    fill(244,164,96);
    rect(gameChar_x,gameChar_y-25,5,10);
    fill("black");
    ellipse(gameChar_x+13,gameChar_y-50,5,5);
	}
	else if(isFalling || isPlummeting)
	{
    strokeWeight(1);
    stroke(120,120,120);
    fill(216,191,216);
    rect(gameChar_x-8,gameChar_y-40,20,30);
    fill(244,164,96);
    ellipse(gameChar_x+2,gameChar_y-50,20,20);
    fill("black");
    rect(gameChar_x,gameChar_y-45,5,1);
    fill("black");
    rect(gameChar_x+4,gameChar_y-10,5,10);
    fill(244,164,96);
    rect(gameChar_x-14,gameChar_y-55,5,20);
    fill("black");
    ellipse(gameChar_x-2,gameChar_y-50,5,5);
    fill("black");
    rect(gameChar_x-4,gameChar_y-10,5,10);
    fill("black");
    ellipse(gameChar_x+7,gameChar_y-50,5,5);
    fill(244,164,96);
    rect(gameChar_x+13,gameChar_y-55,5,20);
	}
	else
	{
    strokeWeight(1);
    stroke(120,120,120);
    fill(216,191,216);
    rect(gameChar_x-8,gameChar_y-40,20,30);
    fill(244,164,96);
    ellipse(gameChar_x+2,gameChar_y-50,20,20);
    fill("black");
    rect(gameChar_x,gameChar_y-45,5,1);
    fill("black");
    rect(gameChar_x+4,gameChar_y-10,5,10);
    fill(244,164,96);
    rect(gameChar_x-12,gameChar_y-40,5,20);
    fill("black");
    ellipse(gameChar_x-2,gameChar_y-50,5,5);
    fill("black");
    rect(gameChar_x-4,gameChar_y-10,5,10);
    fill("black");
    ellipse(gameChar_x+7,gameChar_y-50,5,5);
    fill(244,164,96);
    rect(gameChar_x+9,gameChar_y-40,5,20);
	}
    
}

function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
    {
      fill("white");
      noStroke();
      ellipse(clouds[i].x_pos+80,clouds[i].y_pos-10,30,30);
      ellipse(clouds[i].x_pos+100,clouds[i].y_pos-10,45,45);
      ellipse(clouds[i].x_pos+120,clouds[i].y_pos-10,50,50);
      ellipse(clouds[i].x_pos+140,clouds[i].y_pos-10,40,40);
      ellipse(clouds[i].x_pos+160,clouds[i].y_pos-10,25,25);
    }
}

function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {
      noStroke();
      fill(51,51,51);
      triangle(mountains[i].x_pos+250,mountains[i].y_pos+100,mountains[i].x_pos+151,mountains[i].y_pos+333,mountains[i].x_pos+343,mountains[i].y_pos+333);
      triangle(mountains[i].x_pos+130,mountains[i].y_pos+176,mountains[i].x_pos+218,mountains[i].y_pos+333,mountains[i].x_pos+24,mountains[i].y_pos+333);
      triangle(mountains[i].x_pos+180,mountains[i].y_pos+131,mountains[i].x_pos+267,mountains[i].y_pos+332,mountains[i].x_pos+80,mountains[i].y_pos+331);
    }
}

function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    { 
      fill("brown");
      rect(trees_x[i] + 10,333,40,100);
      fill("green");
      ellipse(trees_x[i] + 28,330,100,100);
    }
}

function drawCollectable(t_collectable)
{   
    if(t_collectable.isFound == false)
    {
    fill("red");
    ellipse(t_collectable.x_pos+30,t_collectable.y_pos+315,t_collectable.size,t_collectable.size);
    fill("green");
    rect(t_collectable.x_pos+19,t_collectable.y_pos+288,t_collectable.size-30,t_collectable.size-35);
    fill("brown");
    rect(t_collectable.x_pos+30,t_collectable.y_pos+285,t_collectable.size-35,t_collectable.size-30);
    }
}

function checkCollectable(t_collectable)
{
    if(dist(gameChar_x,t_collectable.y_pos, t_collectable.x_pos, t_collectable.y_pos) < 40)
    {
      t_collectable.isFound = true;
      collectingSound.play();
      game_score +=1;
    }
}

function drawCanyon(t_canyon)
{
    fill("blue");
    rect(t_canyon.x_pos+15,434,80,t_canyon.width+200);
}

function checkCanyon(t_canyon)
{
    if((gameChar_x > t_canyon.x_pos) && (gameChar_x < t_canyon.x_pos + t_canyon.width) && (gameChar_y == floorPos_y))
    {
        isPlummeting = true; 
    }
}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y - 251);
    
    fill(181,126,220);
    noStroke();
    
    if(flagpole.isReached == true)
    {
        rect(flagpole.x_pos,floorPos_y - 250,51,51);
    }
    else
    {
        rect(flagpole.x_pos,floorPos_y - 50,51,51);
    }
    
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_x - flagpole.x_pos);
    
    if(d < 15)
    {
        flagpole.isReached = true;
        collectFlagSound.play();
    }
}

function checkPlayerDie()
{
    if(gameChar_y > height)
       {
          lives = lives - 1;
           
        if(lives < 3)
        {
            startGame();
        } 
           
       }
}

function livesTokens()
{
    for( var i = 0; i < lives; i++)
        {
            fill("red");
            ellipse(950-30*(i),20,15);
            ellipse(963-30*(i),20,15);
            triangle(943-30*(i),24,957-30*(i),35,969-30*(i),24);
        }
}

function gameTokens()
{
    for(var i = 0; i < game_score; i++)
        {
            fill("red");
            ellipse(240-30*(i),25,20,20);
            fill("green");
            rect(235-30*(i),11,5,2.5);
            fill("brown");
            rect(240-30*(i),10,2.5,5);
        }
}

function createPlatforms(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
        stroke("black");
        fill("green");
        rect(this.x,this.y,this.length, 20); 
        fill("brown")
        rect(this.x,this.y+10,this.length,20);
        }, 
        checkContact: function(gc_x,gc_y)
        {
           if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if( d >= 0 && d < 5)
                {
                    return true;
                }
            }
           return false;
        }
    }
return p;
}

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -1;
            }
        else if(this.currentX < this.x)
            {
                this.inc = 1;
            }
    }
    
    this.draw = function()
    {
        this.update();
        
        //left wing of enemy
        fill("purple");
        stroke("black");
        beginShape();
        vertex(this.currentX+35,this.y-20);
        vertex(this.currentX+55,this.y-40);
        vertex(this.currentX+75,this.y-40);
        vertex(this.currentX+85,this.y-30);
        endShape();
        
        //right wing of enemy
        fill("purple");
        stroke("black");
        beginShape();
        vertex(this.currentX,this.y-20);
        vertex(this.currentX-20,this.y-40);
        vertex(this.currentX-40,this.y-40);
        vertex(this.currentX-50,this.y-30);
        endShape();
        
        //black vertex on the wings
        stroke("black");
        beginShape();
        vertex(this.currentX+75,this.y-30);
        vertex(this.currentX+75,this.y-40);
        endShape();
        
        //black vertex on the wings
        stroke("black");
        beginShape();
        vertex(this.currentX-40,this.y-30);
        vertex(this.currentX-40,this.y-40);
        endShape();
        
        //black vertex on the wings
        stroke("black");
        beginShape();
        vertex(this.currentX+55,this.y-40);
        vertex(this.currentX+55,this.y-24);
        endShape();
        
        //black vertex on the wings
        stroke("black");
        beginShape();
        vertex(this.currentX-20,this.y-40);
        vertex(this.currentX-20,this.y-24);
        endShape();
        
        //black vertex on the wings
        stroke("black");
        beginShape();
        vertex(this.currentX+65,this.y-40);
        vertex(this.currentX+65,this.y-27);
        endShape();
        
        //black vertex on the wings
        stroke("black");
        beginShape();
        vertex(this.currentX-30,this.y-40);
        vertex(this.currentX-30,this.y-27);
        endShape();
        
        //body of enemy
        rect(this.currentX-10,this.y-38,50,35,10);
        
        //mouth of enemy
        fill("white");
        stroke("black");
        ellipse(this.currentX+17,this.y-10,8);
        
        //eyelid of enemy
        stroke("purple");
        fill("black");
        ellipse(this.currentX,this.y-24,25);
        ellipse(this.currentX+35,this.y-24,25);
        
        //white color in eyes
        fill("white");
        ellipse(this.currentX,this.y-24,16);
        ellipse(this.currentX+35,this.y-24,16);
        
        //black color around eyes
        stroke("black");
        ellipse(this.currentX,this.y-24,12);
        ellipse(this.currentX+35,this.y-24,12);
        
        //eyes color
        fill("purple");
        ellipse(this.currentX,this.y-24,8);
        ellipse(this.currentX+35,this.y-24,8);
        
        //eye shine 
        fill("white");
        noStroke();
        ellipse(this.currentX+39,this.y-28,2);
        ellipse(this.currentX-5,this.y-28,2);
        
        
        this.checkContact = function(gc_x,gc_y)
        {
            var d = dist(gc_x,gc_y,this.currentX,this.y);
            
            if(d < 40)
                {
                    return true;
                }
            return false;
        }
    }
}

function startGame()
{
    gameChar_x = width/2 - 100;
	gameChar_y = floorPos_y;
    
    isLeft = false;
    isFalling = false;
    isRight = false;
    isPlummeting = false;

    //arrays
    trees_x = [-450,-30,400,700,900,1200,1600,2200];

    clouds = [{x_pos:100,y_pos:100},{x_pos:300,y_pos:200},{x_pos:500,y_pos:150},{x_pos:700,y_pos:100},{x_pos:900,y_pos:150},{x_pos:1200,y_pos:150},{x_pos:-80,y_pos:200},{x_pos:-400,y_pos:100},{x_pos:-750,y_pos:150}];

    mountains = [{x_pos:100,y_pos:100},{x_pos:550,y_pos:100},{x_pos:950,y_pos:100},{x_pos:-350,y_pos:100},{x_pos:-850,y_pos:100}];

    collectables = [{x_pos:600,y_pos:100,size:40,isFound:false},{x_pos:1100,y_pos:100,size:40,isFound:false},{x_pos:-50,y_pos:100,size:40,isFound:false},{x_pos:100,y_pos:-2,size:40,isFound:false},{x_pos:-260,y_pos:-2,size:40,isFound:false}];

    canyons = [{x_pos:40,width:100},{x_pos:1000,width:100},{x_pos:-300,width:100},{x_pos:480,width:100}]

    cameraPosX = 0;

    game_score = 0;

    flagpole = {isReached: false, x_pos: 1400};

    platforms = [];
    platforms.push(createPlatforms(100,floorPos_y - 100,100));
    platforms.push(createPlatforms(-300,floorPos_y - 100,200));
    platforms.push(createPlatforms(700,floorPos_y - 90,80));
    platforms.push(createPlatforms(1180,floorPos_y - 80,70));

    enemies = [];   
    enemies.push(new Enemy(200,floorPos_y - 10,100));
    enemies.push(new Enemy(600,floorPos_y - 10,100));
    enemies.push(new Enemy(1150,floorPos_y - 10,150));
    enemies.push(new Enemy(-200,floorPos_y - 10,150));
}