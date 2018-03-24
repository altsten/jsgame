//  JSfile modified from different sources
//  Check html-file for more info

//  Modifications: MaHir



// variables related canvas
var canvas;
var ctx;

// images
var car = new Image();
var bg = new Image();
var obstacleLeft = new Image();
var obstacleRight = new Image();

car.src = "images/car.png";
bg.src = "images/road.png";
obstacleLeft.src = "images/objLeft.png";
obstacleRight.src = "images/objRight.png";

// variables related coordinates
var gap = 85;
var constant;

var bX = 140;
var bY = 300;

// player's score
var score = 0;

// variable definning game's state
var gamecontinues=1;

// dictionary for scoreboard
var dict_scores=[];

// obstacles
var obstacles = [];


$(document).ready(function (){

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

  // Eventlistener for Start-button
  $("#start").click(function(){
    // Removes scorelist from view
    $("#score_list").html("");
	

    // Initializes Player's position and obstacles
    obstacles = [] ;
    obstacles[0] = {
      x : -100,
      y : 0
    };

    bX = 140;
    bY = 300;

    gamecontinues=1;
    score=0;
    dict_scores=[];

	$("#info").hide();
    $("#info").addClass("hide");
    $("#canvas").addClass("show");
    PlayGame();

  });

  // Eventlistener for SubmitScore-button
  $("#submit_score").click(function(){
    //For debugging before real actions have been added
    alert("Submit score pressed");
    SubmitScore();
  });

  // Eventlistener for Save-button
  $("#save").click(function(){
    //For debugging before real actions have been added

    alert("Save pressed");
    Save();
  });

  // Eventlistener for Load-button
  $("#load").click(function(){
    //For debugging before real actions have been added
    alert("Load pressed");
    Save();
  });

  // Eventlistener for incoming messages and errors
  window.addEventListener("message", function(e) {
      if(e.data.messageType === "LOAD") {
        obstacles = e.data.gameState.obstacles;
        score = e.data.gameState.score;
        bX = e.data.gameState.bX;
        bY = e.data.gameState.bY;
      }
      else if (e.data.messageType === "ERROR") {
        alert(e.data.info);
      }
    });

});

function Load(){
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
          "positionX": bX,
          "positionY": bY,
          "obstacles": obstacles
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
  ctx.drawImage(bg,0,0);
  
  if (gamecontinues){
    for(var i = 0; i < obstacles.length; i++){

        constant = obstacleLeft.width+gap;
        ctx.drawImage(obstacleLeft, obstacles[i].x, obstacles[i].y);
        ctx.drawImage(obstacleRight, obstacles[i].x+constant, obstacles[i].y);

        // move obstacle
        obstacles[i].y++;
        if( obstacles[i].y == 250 ){
            obstacles.push({
                x : Math.floor(Math.random()*obstacleLeft.width)-obstacleLeft.width,
                y : 0
            });
        }

        // detect collision
        if( bY >= obstacles[i].y && bY <= obstacles[i].y + obstacleLeft.height && (bX <= obstacles[i].x + obstacleLeft.width || bX + car.width >= obstacles[i].x + obstacleLeft.width+gap) || bX < 0 || bX + car.width >= canvas.width){
          gamecontinues=0;
        }
        if(obstacles[i].y == 500){
            obstacles.splice(0,1);
            score++;
        }
    }

    ctx.drawImage(car,bX,bY);

    ctx.fillStyle = "#000";
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
    $("#info").addClass("show");
    $("#canvas").addClass("hide");
  ShowScoreboard()
}

function ShowScoreboard(){

  alert("Peli loppui. Score: "+score);
  dict_scores=[];
  //for testing
  dict_scores.push({
    key: "James",
    value: "16"
  });

  dict_scores.push({
    key: "Janette",
    value: "15"
  });
  dict_scores.push({
    key: "John",
    value: "1"
  });

  gamehaseneded=0;
  $("#score_list").html("");

  $("#score_list").append("<tr><th> Player </th><th> Score </th></tr>");
  for (var i =0; i < dict_scores.length ; i++) {
    $("#score_list").append("<tr><td>" + dict_scores[i].key +"</td><td>" +dict_scores[i].value +"</td></tr>");
  }
  $("#score_list").append("<tr><td> YOU </td><td>" +score+ "</td></tr>");

}

function ShowHide(){
  // Function handling hiding/showing
  // elements based on events
}
