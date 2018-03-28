let canvas = {};
let canvasContext = {};

let ballX = 50;


window.onload = function() {
  console.log("Hello World!");
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  const framesPerSecond = 30;
  setInterval(drawEverything, 1000/framesPerSecond);
}

function drawEverything() {
  ballX = ballX + 5;

  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'blue';
  canvasContext.fillRect(100, 0, 100, 25);
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(ballX, 100, 10, 10);

}
