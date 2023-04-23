const elapsedTimeEl = document.getElementById("elapsedTime");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const screenMessage = document.getElementById("screenMessage");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", startGame);
let gameOver = false;
let gameStarted = false; // Add this variable

let score = 0;
let highScore = 0;
let timer = null;

//board
const blockSize = 25;
// 4:3 aspect ratio 32:24, change size in CSS canvas
const rows = 24;
const cols = 32;
let board;
let context;

//snake head
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

//food
let foodX;
let foodY;

if (JSON.parse(localStorage.getItem("highScore"))) {
  highScore = JSON.parse(localStorage.getItem("highScore"));
}

function updateHighScore() {
  localStorage.setItem("highScore", JSON.stringify(highScore));
  highScoreEl.innerText = `High Score: ${highScore}`;
}

function updateScore() {
  scoreEl.innerText = `Score: ${score}`;
}

let startTime, endTime;

function start() {
  startTime = new Date();
}

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;
  // get seconds
  var seconds = Math.round(timeDiff);
  return seconds;
}

function startGame() {
  gameOver = false;
  gameStarted = false; // Set gameStarted to false
  resetGame();
  resetBoard();
  document.addEventListener("keydown", changeDirection); // Change this from 'keyup' to 'keydown'
  document.addEventListener("keyup", (e) => {
    if (e.code == "Space") {
      startGame();
    }
  });

  timer = setInterval(update, 1000 / 10); //100 milliseconds
  updateHighScore();
  screenMessage.innerText = "Move to Start Game";
}


function resetGame() {
  screenMessage.style.opacity = 100;
  score = 0;
  snakeX = blockSize * 5;
  snakeY = blockSize * 5;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  clearInterval(timer);
  updateScore();
}

function resetBoard() {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d"); //used for drawing on the board

  placeSnake();
  placeFood();
}

function loseGame() {
  let sound = new Audio(`audio/snake-die.wav`);
  sound.play();
  gameOver = true;
  clearInterval();
  screenMessage.style.opacity = 100;
  screenMessage.innerText = "Game Over";
}

function eatFood() {
  snakeBody.push([foodX, foodY]);
  placeFood();
  score += 1;
  scoreEl.innerText = `Score: ${score}`;

  if (score > highScore) {
    highScore = score;
    updateHighScore();
  }
  let sound = new Audio(`audio/snake-eat.wav`);
  sound.play();
}

function update() {
  if (gameOver || !gameStarted) {
    // Add !gameStarted to the condition
    return;
  }
  elapsedTimeEl.innerText = `Time: ${end()}`;

  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  if (snakeX == foodX && snakeY == foodY) {
    eatFood();
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  context.fillStyle = "lime";
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
  }

  //game over conditions
  if (
    snakeX < 0 ||
    snakeX > cols * blockSize ||
    snakeY < 0 ||
    snakeY > rows * blockSize
  ) {
    loseGame();
  }

  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
      loseGame();
    }
  }
}

function changeDirection(e) {
  if (!gameOver) {
    screenMessage.style.opacity = 0;
    if (!gameStarted) {
      // Start the timer when the player moves for the first time
      gameStarted = true;
      start();
    }
  }

  if ((e.code == "ArrowUp" || e.code == "KeyW") && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if ((e.code == "ArrowDown" || e.code == "KeyS") && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if ((e.code == "ArrowLeft" || e.code == "KeyA") && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if ((e.code == "ArrowRight" || e.code == "KeyD") && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}


function placeFood() {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
}

function placeSnake() {
  snakeX = Math.floor(Math.random() * cols) * blockSize;
  snakeY = Math.floor(Math.random() * rows) * blockSize;
}

window.onload = startGame;
