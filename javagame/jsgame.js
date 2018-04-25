//  JSfile modified from different sources
//  Check html-file for more info

//  Modifications: MaHir



// variables related canvas
var canvas;
var ctx;

//settings
var settings = {
    width: 500,
    height: 500,
}

// images
var car = new Image();
var bg = new Image();
var obstacleLeft = new Image();
var obstacleRight = new Image();

car.src = "images/car.png";
bg.src = "images/road.png";
obstacleLeft.src = "images/objLeft.png";
obstacleRight.src = "images/objRight.png";

// variables related coordinates and size
var gap = 85;
var constant;

// car location variables
var bX=0;
var bY=0;

// window size variables
var height;
var width;

// player's score
var score = 0;

// variable definning game's state
var gamecontinues=1;

// dictionary for scoreboard
var dict_scores=[];

// obstacles
var obstacles = [];


$(document).ready(function (){
  //notify parent window about optimal size for the game
  //game store can modify them to fit into the users screen
  sendSettingsMsg ();

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");


  // Eventlistener for player's arrow keys
  // and related move actions
  document.addEventListener("keydown", function (e) {
    if (gamecontinues){
      switch (e.key) {
         case 'ArrowUp':
             bY -= 20;
             break;
         case 'ArrowDown':
             bY += 20;
             break;
         case 'ArrowLeft':
             bX -= 20;
             break;
         case 'ArrowRight':
             bX += 20;
     }
   }
  });

  // Eventlistener for player's touches
  // and related move actions (only left/right)
  document.addEventListener("touchstart", function (e) {
    if (gamecontinues){
      var xPos= e.originalEvent.touches[0].clientX;
      if (xPos<width/2)
      {
        bX -= 20;
        }
      else
      {
         bX += 20;
       }
     }
  });



  // Eventlistener for Start-button
  $("#start").click(function(){

    ModifySize();
    // Removes scorelist from view
    $("#score_list").html("");


    // Initializes Player's position and obstacles
    obstacles = [] ;
    obstacles[0] = {
      x : -100,
      y : 0
    };

    bX = width/2;
    bY = height-100;

    gamecontinues=1;
    score=0;
    dict_scores=[];

	$("#info").hide();
  PlayGame();

  });

  // Eventlistener for SubmitScore-button
  $("#submit_score").click(function(){
    SubmitScore();
  });

  // Eventlistener for Save-button
  $("#save").click(function(){
    Save();
  });

  // Eventlistener for Load-button
  $("#load").click(function(){
    Load();
  });

  // Eventlistener for incoming messages and errors
  window.addEventListener("message", function(e) {
      if(e.data.messageType === "LOAD") {

        ModifySize();

        score = e.data.gameState.score;

        // These are the location variables for the car
        bX = e.data.gameState.bX*width;
        bY = e.data.gameState.bY*height;


        // Game starts with specs above
        // and basic setting below
        gamecontinues=1;
        obstacles = [] ;
        obstacles[0] = {
          x : -100,
          y : 0
        };

        $("#info").hide();
        PlayGame();
      }
      else if (e.data.messageType === "ERROR") {
        alert(e.data.info);
      }
    });


});

function sendSettingsMsg () {
    var msg = {
        messageType: "SETTING",
        options: {
            "width": settings.width,
            "height": settings.height
        }
    };
    window.parent.postMessage(msg, "*");
}

function Load(){
	EndGame();
  var msg = {
        "messageType": "LOAD_REQUEST",
      };
      window.parent.postMessage(msg, "*");
}

function Save(){
  var msg = {
        "messageType": "SAVE",
        "gameState": {
          "score": score,
          "bX": bX/width,
          "bY": bY/height,
        }
      };
      window.parent.postMessage(msg, "*");
}

function SubmitScore(){
  //send message
  var msg = {
        "messageType": "SCORE",
        "score": score
      };
      window.parent.postMessage(msg, "*");
}

function PlayGame(){

  //ctx.drawImage(bg,0,0);

  // Background adapt the size of canvas
  // The color is set at the same time

  ctx.fillStyle = "#9ea7b8";
  ctx.fillRect(0,0,width,height);


  if (gamecontinues){
    for(var i = 0; i < obstacles.length; i++){

        constant = width+gap;
        ctx.drawImage(obstacleLeft, obstacles[i].x, obstacles[i].y,width,0.05*height);
        ctx.drawImage(obstacleRight, obstacles[i].x+constant, obstacles[i].y,width,0.05*height);

        // Move obstacle
        obstacles[i].y++;

        // New obstacle is added when previous passes the point
        if( obstacles[i].y == Math.floor(canvas.height/3) ){
            obstacles.push({
                x : Math.floor(Math.random()*width)-width,
                y : 0
            });
        }

        // Detect collision
        if( bY >= obstacles[i].y && bY <= obstacles[i].y + 0.05*height && (bX <= obstacles[i].x + width || bX + car.width >= obstacles[i].x + width+gap) || bX < 0 || bX + car.width >= canvas.width){
          gamecontinues=0;
        }
        // Obstacle is removed and points are increased when obstacle
        // is at the bottom of the canvas
        if(obstacles[i].y == Math.floor(canvas.height)){
            obstacles.splice(0,1);
            score++;
        }
    }

    ctx.drawImage(car,bX,bY);

    ctx.fillStyle ="#000000";
    ctx.font = "bold 15px Arial";
    ctx.fillText("Score : "+score,0.5*canvas.width-30,canvas.height-30);

    requestAnimationFrame(PlayGame);
  }
  else {
    EndGame();
  }
}

function EndGame(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
	$("#info").show();
  ShowScoreboard()
}

function ShowScoreboard(){

  alert("Peli loppui. Score: "+score);

  gamehaseneded=0;
  $("#score_list").html("");

  $("#score_list").append("<tr><th> Player </th><th> Score </th></tr>");
  $("#score_list").append("<tr><td> YOU </td><td>" +score+ "</td></tr>");

}

function ModifySize(){
  // Canvas adapts the dimensions of parent window
  width=window.innerWidth;
  height=window.innerHeight;

  // buttons dimensions are changed also based on parent window
  var buttons = document.getElementsByTagName("button");
  for (var i = 0; i < buttons.length; i++) {
    var buttonvariable = buttons[i];
    if (width>200)
    {
      buttonvariable.style.width="49%";
      //canvas height is been reduced by total 2 x buttonHeight
      height=height-25;
    }
    else
    {
      buttonvariable.style.width="100%";
      //canvas height is been reduced by total 1 x buttonHeight
      height=height-12;
    }

  }

  canvas.width=width;
  canvas.height=height;

}
