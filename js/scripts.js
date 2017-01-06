var paddles = [];
var score;
var ball;

var myArea = {
  canvas : document.createElement("canvas"),
  start : function(){
    this.canvas.width = 800;
    this.canvas.height = 800;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateMyArea, 20);
    this.canvas.style.cursor = "none";
    window.addEventListener('mousemove', function(e){
      myArea.x = e.clientX - (myArea.canvas.offsetLeft - window.pageXOffset);
      myArea.y = e.clientY -(myArea.canvas.offsetTop - window.pageYOffset);
    });
  },
  clear : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function(){
    clearInterval(this.interval);
  }

}

function Component (width, height, x, y, type, position){

  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.type = type;
  this.position = position;
  this.speedX = 1;
  this.speedY = 1;
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
    }
    if(this.type === "vPaddle"){
      if(myArea.y > 650){myArea.y = 650}
      if(myArea.y < 30) {myArea.y = 30}
      this.y = myArea.y;
    }
    if(this.type === "ball"){
      this.x += this.speedX;
      this.y += this.speedY;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);

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
          this.speedY *= -1;
        }
        if(position === "top" && myTop < otherBottom){
          this.speedY *= -1;
        }
      }
    }
    if(otherObj.type == "vPaddle"){
      if(myTop < otherBottom & myBottom > otherTop){
        if(position === "right" && myRight  > otherLeft){
          this.speedX *= -1;
        }
        if(position === "left" && myLeft < otherRight){
          this.speedX *= -1;
        }
      }
    }


  //
  //   if(this.x > 780 || this.x < 10){this.speedX = -(this.speedX)}
  //   if(this.y > 780 || this.y <10){this.speedY = -(this.speedY)}
  }

}

function updateMyArea(){
  myArea.clear();
  paddles.forEach(function(paddle){
    paddle.update();
    ball.crashWith(paddle);
    ball.update();
  })
}


myArea.start();
ball = new Component(10, 10, 150, 10, "ball");
paddles.push(new Component(120, 10, 10, 780, "hPaddle", "bottom"));
paddles.push(new Component(120, 10, 20, 10, "hPaddle", "top"));
paddles.push(new Component(10, 120, 10, 10, "vPaddle", "left"));
paddles.push(new Component(10, 120, 780, 10, "vPaddle", "right"));
