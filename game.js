const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = new Image();
ball.src = './assets/images/ball.png';
const ballDi = 25;
let ballXPos = canvas.width/2;
let ballYPos = canvas.height - 60;
let ballXSpeed = 2;
let ballYSpeed = -4;

const paddle = new Image();
paddle.src = './assets/images/paddle.png';
const paddleHeight = 25;
const paddleWidth = 100;
const paddlePadding = 5;
let paddleX = (canvas.width-paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

const heart = new Image();
heart.src = './assets/images/heart.png';
const heartWidth = 30;
const heartHeight = 28;
const heartPadding = 10;
let hearts = [1, 1, 1];

const brickRowCount = 8;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 80;
const brickOffsetLeft = 64;
const bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
console.log(bricks);


function drawBall() {
  ctx.beginPath();
  // ctx.arc(ballXPos, ballYPos, ballRadius, 0, Math.PI*2);
  ctx.drawImage(ball, ballXPos, ballYPos, ballDi, ballDi)
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  // ctx.rect(paddleX, canvas.height-paddleHeight-paddlePadding, paddleWidth, paddleHeight);
  ctx.drawImage(paddle, paddleX, canvas.height-paddleHeight-paddlePadding, paddleWidth, paddleHeight);
  // ctx.fillStyle = "#0095DD";
  // ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawHearts() {
  let heartXOffset = 20;
  ctx.beginPath();
  for (h = 0; h < hearts.length; h++) {
    ctx.drawImage(heart, heartXOffset, 18, heartWidth, heartHeight);
    heartXOffset += 35;
  }
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawHearts();

  // Left and right wall collision
  if (ballXPos < 0 || ballXPos + ballDi > canvas.width) {
    ballXSpeed = -ballXSpeed;
  }

  // Top wall collision
  if (ballYPos + ballYSpeed < 0) {
    ballYSpeed = -ballYSpeed;
  }

  // Paddle and ground collision
  if (ballYPos > canvas.height - ballDi - paddleHeight - paddlePadding) {
    if (ballXPos > paddleX && ballXPos < paddleX + paddleWidth && ballYPos < canvas.height-paddleHeight-paddlePadding) {
      ballYSpeed = -ballYSpeed;
    } else if (ballYPos > canvas.height) {
      ballReset();
    }
  }

  ballXPos += ballXSpeed;
  ballYPos += ballYSpeed;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }
}

function ballReset() {
  if (hearts.length <= 1) {
    alert('GAME OVER');
    hearts = [1, 1, 1];
  } else {
    hearts.pop();
  }

  ballXPos = paddleX + paddleWidth/2;
  ballYPos = canvas.height - 60;
  ballXSpeed = 2;
  ballYSpeed = -4;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (ballXPos > b.x && ballXPos < b.x+brickWidth && ballYPos > b.y && ballYPos < b.y+brickHeight) {
          b.status = 0;
          ballYSpeed = -ballYSpeed;
        }
      }
    }
  }
}

setInterval(draw, 10);

