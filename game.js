let canvas;
let canvasContext;

let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 5;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WALL_PADDING = 10;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = true;

const hitSound = new Audio('assets/square_beep.wav');
const missSound = new Audio('assets/square_miss.wav');
const winSound = new Audio('assets/square_win.wav');
const loseSound = new Audio('assets/square_lose.wav');


function playSoundEffect(sound) {
  if (typeof prevSound === 'undefined') {
    let prevSound = sound;
    sound.play();
  } else {
    prevSound.pause();
    prevSound.currentTime = 0;
    sound.play();
    prevSound = sound;
  }
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  console.log("Hello World!");
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick)

  canvas.addEventListener('mousemove', function(evt) {
    const mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y;
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
  if (player1Score >= WINNING_SCORE) {
    showingWinScreen = true;
    playSoundEffect(winSound);
  } else if (player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
    playSoundEffect(loseSound);
  } else {
    playSoundEffect(missSound);
  }

  if (ballX < 0 || ballX > canvas.width) {
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
  }
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT  / 2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 10;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 10;
  }
}

function moveEverything() {
  if(showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < PADDLE_WIDTH + WALL_PADDING + 10) {
    console.log("Test")
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.30;
      playSoundEffect(hitSound);
    } else if (ballX < 0) {
      player2Score++; // Must be before ballReset()
      ballReset();
    }
  }
  if (ballX > canvas.width - (WALL_PADDING + PADDLE_WIDTH + 10)) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.30;
      playSoundEffect(hitSound);
    } else if (ballX > canvas.width) {
      player1Score++;
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

function drawNet() {
  for (let i = 10; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'grey');
  }
}

function drawEverything() {
  // Canvas
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  // Start screen
  if (showingWinScreen) {
    canvasContext.font = '80px serif'
    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillStyle = 'green';
      canvasContext.fillText('VICTORY', 225, 250);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillStyle = 'red';
      canvasContext.fillText('DEFEAT', 256, 250);
    } else {
      canvasContext.fillStyle = 'white';
      canvasContext.fillText('Definitely not Pong', 85, 250);
    }
    canvasContext.font = '45px serif'
    canvasContext.fillStyle = 'white';
    canvasContext.fillText('click to continue', 250, 400);
    return;
  }

  // Scoreboard
  canvasContext.font = '45px sans-serif'
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(player1Score, 190, 70);
  canvasContext.fillText(player2Score, 590, 70);

  drawNet();

  // Left paddle
  colorRect(WALL_PADDING, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  // Right paddle
  colorRect(canvas.width - PADDLE_WIDTH - WALL_PADDING, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
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
