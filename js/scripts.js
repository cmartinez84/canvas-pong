var paddles = [];
var boardScore;
var ball;
var ping;
var sparks = [];

var scoresRef = firebase.database().ref('scores');
function HighScore(person, finalScore){
  this.person = person;
  this.finalScore = finalScore;
}

var myArea = {
  canvas : document.createElement("canvas"),
  start : function(){
    this.canvas.width = 800;
    this.gameOver = false;
    this.canvas.height = 800;
    this.frameNo = 0;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[2]);
    this.interval = setInterval(updateMyArea, 20);
    this.canvas.style.cursor = "none";
    window.addEventListener('mousemove', function(e){
      myArea.x = e.clientX - (myArea.canvas.offsetLeft - window.pageXOffset);
      myArea.y = e.clientY -(myArea.canvas.offsetTop - window.pageYOffset);
    });
    paddles = [];
    mySound = new Audio("sounds/ping.wav");
    var ballStartX =  200+Math.floor(Math.random() * 300);
    var ballStartY = 200+Math.floor(Math.random() * 300);

    var ballSpeedsX = [1, -1];
    var ballSpeedsY = [2, -2];
    var randomSpeedX = Math.floor(Math.random() * 2);
    var randomSpeedY = Math.floor(Math.random() * 2);
    var ballSpeedX = ballSpeedsX[randomSpeedX];
    var ballSpeedY = ballSpeedsY[randomSpeedY];
    ball = new Component(10, 10, ballStartX, ballStartY, "ball", null);
    ball.speedX = 4;
    ball.speedX = ballSpeedX;
    ball.speedY = ballSpeedY;
    boardScore = new Component(10, 10, 300, 10, "text", null);
    paddles.push(new Component(120, 10, 10, 780, "hPaddle", "bottom"));
    paddles.push(new Component(120, 10, 20, 10, "hPaddle", "top"));
    paddles.push(new Component(10, 120, 10, 10, "vPaddle", "left"));
    paddles.push(new Component(10, 120, 780, 10, "vPaddle", "right"));

  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function(){
    clearInterval(this.interval);
  }
}




function Component (width, height, x, y, type, position){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.type = type;
  this.position = position;
  this.speedX = 1;
  this.speedY = 2;
  ctx = myArea.context;
  ctx.fillStyle = "white";
  ctx.fillRect(this.x, this.y, this.width, this.height);
  this.update = function(){
    ctx = myArea.context;
    ctx.fillStyle = "white";
    if(this.type === "hPaddle"){
      if(myArea.x >650){myArea.x = 650}
      if(myArea.x <30){myArea.x = 30}
      this.x = myArea.x;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    else if(this.type === "vPaddle"){
      if(myArea.y > 650){myArea.y = 650}
      if(myArea.y < 30) {myArea.y = 30}
      this.y = myArea.y;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    else if(this.type === "ball"){
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += .001;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    else if (this.type === "text"){
      ctx.fillStyle = "white";
      ctx.font = "50px Arial";
      ctx.fillText(myArea.frameNo, 600, 100);
    }
  },
  this.crashWith = function(otherObj){
    var myLeft = this.x;
    var myRight = this.x + this.width;
    var myTop = this.y;
    var myBottom = this.y + this.height;
    var otherLeft = otherObj.x;
    var otherRight = otherObj.x + otherObj.width;
    var otherTop = otherObj.y;
    var otherBottom = otherObj.y + otherObj.height;
    var position = otherObj.position;
    if(otherObj.type == "hPaddle"){
      if(myLeft < otherRight && myRight > otherLeft){
        if(position === "bottom" && myBottom  > otherTop){
          mySound.play();
          this.speedY *= -1;
          drawSparks(this.x, this. y, (this.speedX * -4), (this.speedY *4));
        }
        if(position === "top" && myTop < otherBottom){
          mySound.play();
          this.speedY *= -1;
          drawSparks(this.x, this. y, (this.speedX * -4 ), this.speedY);
        }
      }
    }
    if(otherObj.type == "vPaddle"){
      if(myTop < otherBottom & myBottom > otherTop){
        if(position === "right" && myRight  > otherLeft){
               mySound.play();
          this.speedX *= -1;
          drawSparks(this.x, this. y, (this.speedX *4), (this.speedY *4));
        }
        if(position === "left" && myLeft < otherRight){
          mySound.play();
          this.speedX *= -1;
          drawSparks(this.x, this. y, (this.speedX *4), (this.speedY *4));
        }
      }
    }
  },
  this.outOfBounds = function(){
      if(this.x > 800 || this.x < 0  || this.y > 800 || this.y < 0){
        myArea.stop();
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.fillText(" G A M E O V E R", 200, 400);
        setTimeout(function(){
          if(myArea.gameOver === false){
            myArea.gameOver = true;
            var winner = prompt("whoa, looks like you finished a game. Enter a name");
            var winner;
            $("#playAgain").show();
            if(winner){
              var playerAndScore = new HighScore(winner, myArea.frameNo);
              scoresRef.push(playerAndScore);
            }
            drawHighScores();
          }
        }, 500);
      }
}}

function Spark (x, y, width, height, speedX, speedY){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = speedX;
  this.speedY = speedY;
  this.gravity = 0.4;
  this.gravitySpeed =0;
  ctx = myArea.context;
  // ctx.fillStyle = "green";
  ctx.fillRect(this.x, this.y, this.width, this.height);
  this.update = function(){
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function updateMyArea(){
  myArea.frameNo ++;
  myArea.clear();
  boardScore.update();
  paddles.forEach(function(paddle){
    paddle.update();
    ball.crashWith(paddle);
    ball.outOfBounds();
    ball.update();
  });

  if(sparks.length >0){
    sparks.forEach(function(spark){
      spark.update();
    });
  }
}
var playAgain = function(){
    $("#playAgain").hide();
    myArea.frameNo = 0;
    myArea.start();
}

var drawHighScores = function(){
  $("#highScores").empty();
    scoresRef.orderByChild('finalScore').limitToLast(5).on('value', function(snap){
        snap.forEach(function(e){
            $("#highScores").prepend("<li><span>"+e.val().person +" "+ e.val().finalScore +"</span>");
        });
    });
}
var randos = [];

var drawSparks = function(x, y, speedX, speedY){
  // if(speedY > 0){ speedY * 3};
  randos[0] = 8-(Math.floor(Math.random() * 90))/10;
  randos[1] = 8-(Math.floor(Math.random() * 90))/10;
  randos[2] = 8-(Math.floor(Math.random() * 90))/10;
  randos[3] = 8-(Math.floor(Math.random() * 90))/10;
  randos[4] = 8-(Math.floor(Math.random() * 90))/10;
  randos[5] = 8-(Math.floor(Math.random() * 90))/10;
  randos[6] = 8-(Math.floor(Math.random() * 90))/10;
  randos[7] = 8-(Math.floor(Math.random() * 90))/10;
  randos[8] = 8-(Math.floor(Math.random() * 90))/10;
  randos[9] = 8-(Math.floor(Math.random() * 90))/10;
  randos[10] = 8-(Math.floor(Math.random() * 90))/10;
  randos.forEach(function(rando){
    sparks.push(new Spark (x, y, 3, 3 , speedX + rando, speedY - ((rando*rando)/6)));
    sparks.push(new Spark (x, y, 3, 3 , speedX - (rando/ (rando*rando)), speedY - ((rando)/6)));
  });

  // sparks.push(new Spark (x, y, 3, 3, speedX, speedY));
}



myArea.start();
drawHighScores();
