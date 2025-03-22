// Add interactivity if needed
document.querySelector('.btn').addEventListener('click', () => {
  alert('Added to Cart!');
});

// flappy 
const canvas = document.getElementById('flappyBird');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const scoreDisplay = document.getElementById('score');
const discountDisplay = document.getElementById('discount');

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -10, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;
let animationFrameId;

// Set Canvas Size
function setCanvasSize() {
  const maxWidth = 320;
  const maxHeight = 480;

  if (window.innerWidth < maxWidth) {
    canvas.width = window.innerWidth - 40;
    canvas.height = (window.innerWidth - 40) * (maxHeight / maxWidth);
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

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
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

    if (bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
      gameOver = true;
    }

    if (pipe.x + pipe.width < bird.x && !pipe.passed) {
      score++;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

// Draw Score
function drawScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Draw Discount
function drawDiscount() {
  let discount = Math.min(score * 5, 50);
  discountDisplay.textContent = `You earned a ${discount}% discount!`;
}

// Reset Game
function resetGame() {
  console.log("Game reset!"); // Debugging
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

  gameLoop();
}

// Game Loop
function gameLoop() {
  if (gameOver) {
    drawDiscount();
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
  console.log("Play button clicked!"); // Debugging
  if (!gameStarted) {
    resetGame();
  }
});

document.addEventListener('keydown', () => {
  if (gameStarted && !gameOver) bird.velocity = bird.lift;
});

document.addEventListener('touchstart', () => {
  if (gameStarted && !gameOver) bird.velocity = bird.lift;
});

// Set initial canvas size
setCanvasSize();

// Update canvas size on window resize
window.addEventListener('resize', setCanvasSize);
