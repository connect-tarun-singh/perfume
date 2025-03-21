// Add interactivity if needed
document.querySelector('.btn').addEventListener('click', () => {
  alert('Added to Cart!');
});
// Flappy Bird Game
const canvas = document.getElementById('flappyBird');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.1, lift: -10, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;
let animationFrameId;

function drawBird() {
  ctx.fillStyle = '#5C3D2E';
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = '#3E2723';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
  });
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function updatePipes() {
  if (frame % 90 === 0) {
    let gap = 100;
    let top = Math.random() * (canvas.height - gap);
    pipes.push({ x: canvas.width, width: 40, top: top, bottom: canvas.height - top - gap });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Check for collision
    if (bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
      gameOver = true;
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

function drawScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}

function drawDiscount() {
  let discount = Math.min(score * 5, 50); // Max discount of 50%
  document.getElementById('discount').textContent = `You earned a ${discount}% discount!`;
}

function resetGame() {
  // Reset game state
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameStarted = true;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reset score and discount display
  document.getElementById('score').textContent = `Score: 0`;
  document.getElementById('discount').textContent = '';

  // Stop the current game loop (if running)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Start the game loop
  gameLoop();
}

function gameLoop() {
  if (gameOver) {
    drawDiscount();
    gameStarted = false; // Allow the game to be restarted
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

playButton.addEventListener('click', () => {
  if (!gameStarted) {
    resetGame(); // Reset and start the game
  }
});

document.addEventListener('keydown', () => {
  if (gameStarted && !gameOver) bird.velocity = bird.lift;
});

// Add touch event for mobile devices
document.addEventListener('touchstart', () => {
  if (gameStarted && !gameOver) bird.velocity = bird.lift;
});
// Set canvas size based on device width
function setCanvasSize() {
  const maxWidth = 320; // Maximum width for the game
  const maxHeight = 480; // Maximum height for the game

  // Adjust canvas size for smaller screens
  if (window.innerWidth < maxWidth) {
    canvas.width = window.innerWidth - 40; // Leave some padding
    canvas.height = (window.innerWidth - 40) * (maxHeight / maxWidth); // Maintain aspect ratio
  } else {
    canvas.width = maxWidth;
    canvas.height = maxHeight;
  }
}

// Call the function to set initial canvas size
setCanvasSize();

// Update canvas size when the window is resized
window.addEventListener('resize', setCanvasSize);
