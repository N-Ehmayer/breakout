const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ball = new Image();
ball.src = './assets/images/ball.png';
const ballDi = 25;
let ballXPos = canvas.width/2;
let ballYPos = canvas.height - 55;
let ballXSpeed = 0;
let ballYSpeed = 0;
let playBall = false;
let ballInPlay = false;

const paddle = new Image();
paddle.src = './assets/images/paddle.png';
const paddleHeight = 25;
const paddleWidth = 100;
const paddlePadding = 5;
let paddleX = (canvas.width-paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

const life = new Image();
life.src = './assets/images/ball.png';
const lifeWidth = 30;
const lifeHeight = 30;
let lives = [1, 1, 1];

let score = 0;

const brickRowCount = 8;
const brickColumnCount = 8;
const brickCount = 64;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 5;
const brickOffsetTop = 80;
const brickOffsetLeft = 81.5;
let clearedBricks = [0];
const bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}


function drawBall() {
  if (!ballInPlay) {
    ballXPos = paddleX+paddleWidth/2 - ballDi/2
    ballYPos = canvas.height - 55;
  }
  ctx.beginPath();
  ctx.drawImage(ball, ballXPos, ballYPos, ballDi, ballDi)
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.drawImage(paddle, paddleX, canvas.height-paddleHeight-paddlePadding, paddleWidth, paddleHeight);
  ctx.closePath();
}


function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status !== 0) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);

        const linearGradient = ctx.createLinearGradient(200, 0, 200, 200);
        linearGradient.addColorStop(0, 'white');
        linearGradient.addColorStop(1, "#0095DD");
        const linearGradientDamaged = ctx.createLinearGradient(150, 0, 150, 150);
        linearGradientDamaged.addColorStop(0, 'white');
        linearGradientDamaged.addColorStop(1, '#75d1ff');

        if (bricks[c][r].status == 1) {
          // ctx.fillStyle = "#0095DD";
          ctx.fillStyle = linearGradient;
        } else {
          // ctx.fillStyle = "#63ccff";
          ctx.fillStyle = linearGradientDamaged;
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawLives() {
  let lifeXOffset = 20;
  ctx.beginPath();
  for (h = 0; h < lives.length; h++) {
    ctx.drawImage(life, lifeXOffset, 18, lifeWidth, lifeHeight);
    lifeXOffset += 35;
  }
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawLives();
  drawScore();
  winCondition();

  if (ballInPlay && playBall) {
    activateBall();
  }

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
    if (ballXPos+ballDi > paddleX && ballXPos < paddleX + paddleWidth && ballYPos < canvas.height-paddleHeight-paddlePadding) {
      ballYSpeed = -ballYSpeed;
      let deltaX = (ballXPos+ballDi/2) - (paddleX+paddleWidth/2);
      ballXSpeed = deltaX * 0.10;
    } else if (ballYPos > canvas.height) {
      ballReset();
    }
  }

  ballXPos += ballXSpeed;
  ballYPos += ballYSpeed;


  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 8;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 8;
  }
  requestAnimationFrame(draw);
}

function activateBall() {
  ballXSpeed = 1;
  ballYSpeed = -6;
}

function winCondition() {
  if (clearedBricks.length >= brickCount+1) {
    ballReset();
  }
}

function ballReset() {
  if (lives.length <= 1 || clearedBricks.length >= brickCount+1) {
    if (lives.length <= 1) {
      alert('GAME OVER');
    } else {
      alert(`YOU WIN\n SCORE: ${score}`)
    }

    lives = [1, 1, 1];
    clearedBricks = [0];
    for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        bricks[c][r].status = 1;
      }
    }
  } else {
    lives.pop();
  }
  ballXSpeed = 0;
  ballYSpeed = 0;
  ballInPlay = false;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
  if (e.keyCode == 32 && !ballInPlay) {
    ballInPlay = true;
    playBall = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
  if (e.keyCode = 32) {
    playBall = false
  }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collisionDetection() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      var brick = bricks[c][r];
      if (brick.status !== 0) {
        if (ballXPos+ballDi > brick.x && ballXPos < brick.x+brickWidth && ballYPos+ballDi > brick.y && ballYPos < brick.y+brickHeight) {
          if (brick.status == 1) {
            brick.status = 2;
            ballYSpeed = -ballYSpeed;
            score += 5
          } else {
            brick.status = 0;
            ballYSpeed = -ballYSpeed;
            clearedBricks.push(brick);
            score += 25
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.beginPath();
  ctx.font = '20px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, canvas.width - 120, 40);
  ctx.closePath();
}

draw();

