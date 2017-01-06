// var paddles = [];
var score;

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

function Component (width, height, x, y, type){
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.type = type;
  this.speedX = 0;
  this.speedY = 0;
  ctx = myArea.context;
  ctx.fillStyle = "white";
  ctx.fillRect(this.x, this.y, this.width, this.height);
  this.update = function(){
    ctx = myArea.context;
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

}

  function updateMyArea(){
    myArea.clear();
    if(myArea.x && myArea.y){
      myPaddle.x = myArea.x;
      myPaddle.y = myArea.y;
      console.log(myPaddle.x);
    }
    myPaddle.update();

  }
myArea.start();

var myPaddle = new Component(120, 10, 100, 100, "thing" );
