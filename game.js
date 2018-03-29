let canvas;
let canvasContext;

let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;


window.onload = function() {
  console.log("Hello World!");
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousemove', function(evt) {
    const mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - 18;
  })
}

function calculateMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = evt.clientX - rect.left - root.scrollLeft;
  const mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function ballReset() {
  if (ballX < 0 || ballX > canvas.width) {
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
  }
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 10;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 10;
  }
}

function moveEverything() {
 computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < PADDLE_WIDTH + 30) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
    }
  }
  if (ballX > canvas.width  - 40) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
    } else {
      ballReset();
    }
  }
  if (ballY < 10) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height - 10) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawEverything() {
  // Canvas
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  // Left paddle
  colorRect(20, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  // Right paddle
  colorRect(canvas.width - PADDLE_WIDTH - 20, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  // Ball
  colorCircle(ballX, ballY, 10, 'white');
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
