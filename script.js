// Add interactivity if needed
document.querySelector('.btn').addEventListener('click', () => {
  alert('Added to Cart!');
});
// Flappy Bird Game
// Flappy Bird Game
const canvas = document.getElementById('flappyBird');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');
const discountDisplay = document.getElementById('discount');

// Game Variables
let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -10, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;
let animationFrameId;

// Sound Effects (uncomment and add sound files to use)
// const flapSound = new Audio('flap.mp3');
// const gameOverSound = new Audio('gameover.mp3');

// Set Canvas Size
function setCanvasSize() {
  const maxWidth = 320; // Maximum width for the game
  const maxHeight = 480; // Maximum height for the game

  if (window.innerWidth < maxWidth) {
    canvas.width = window.innerWidth - 40; // Leave some padding
    canvas.height = (window.innerWidth - 40) * (maxHeight / maxWidth); // Maintain aspect ratio
  } else {
    canvas.width = maxWidth;
    canvas.height = maxHeight;
  }
}

// Draw Bird
function drawBird() {
  ctx.fillStyle = '#5C3D2E';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Draw Pipes
function drawPipes() {
  ctx.fillStyle = '#3E2723';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

// Update Bird Position
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Check for collision with ground or sky
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
    // if (gameOverSound) gameOverSound.play();
  }
}

// Update Pipes
function updatePipes() {
  if (frame % 90 === 0) {
    let gap = 100;
    let top = Math.random() * (canvas.height - gap);
    pipes.push({ x: canvas.width, width: 40, top: top, bottom: canvas.height - top - gap, passed: false });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Check for collision with bird
    if (bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
      gameOver = true;
      // if (gameOverSound) gameOverSound.play();
    }

    // Increase score if pipe is passed
    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// Draw Score
function drawScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Draw Discount
function drawDiscount() {
  let discount = Math.min(score * 5, 50); // Max discount of 50%
  discountDisplay.textContent = `You earned a ${discount}% discount!`;
}

// Reset Game
function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameStarted = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scoreDisplay.textContent = `Score: 0`;
  discountDisplay.textContent = '';

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  gameLoop();
}

// Game Loop
function gameLoop() {
  if (gameOver) {
    drawDiscount();
    gameOverScreen.style.display = 'block';
    gameStarted = false;
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  updateBird();
  updatePipes();
  drawScore();

  frame++;
  animationFrameId = requestAnimationFrame(gameLoop);
}

// Event Listeners
playButton.addEventListener('click', () => {
  if (!gameStarted) {
    resetGame();
  }
});

restartButton.addEventListener('click', () => {
  resetGame();
});

document.addEventListener('keydown', () => {
  if (gameStarted && !gameOver) {
    bird.velocity = bird.lift;
    // if (flapSound) flapSound.play();
  }
});

document.addEventListener('touchstart', () => {
  if (gameStarted && !gameOver) {
    bird.velocity = bird.lift;
    // if (flapSound) flapSound.play();
  }
});

// Set initial canvas size
setCanvasSize();

// Update canvas size on window resize
window.addEventListener('resize', setCanvasSize);
