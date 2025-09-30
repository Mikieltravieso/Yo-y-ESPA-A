document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const statusEl = document.getElementById('status');

  const tileSize = 24;
  const columns = Math.floor(canvas.width / tileSize);
  const rows = Math.floor(canvas.height / tileSize);
  const colors = getComputedStyle(document.documentElement);

  const state = {
    snake: [],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 0, y: 0 },
    running: false,
    gameOver: false,
    score: 0,
    moveInterval: 160,
    lastMoveTime: 0,
    colorOffset: 0
  };

  function resetGame() {
    const startX = Math.floor(columns / 2);
    const startY = Math.floor(rows / 2);
    state.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    state.direction = { x: 1, y: 0 };
    state.nextDirection = { x: 1, y: 0 };
    state.score = 0;
    state.moveInterval = 160;
    state.running = false;
    state.gameOver = false;
    state.colorOffset = 0;
    scoreEl.textContent = state.score;
    statusEl.textContent = '¡Benvenuti! Pulsa cualquier flecha para empezar.';
    spawnFood();
  }

  function spawnFood() {
    let valid = false;
    while (!valid) {
      const x = Math.floor(Math.random() * columns);
      const y = Math.floor(Math.random() * rows);
      valid = !state.snake.some(segment => segment.x === x && segment.y === y);
      if (valid) {
        state.food = { x, y };
      }
    }
  }

  function gameLoop(timestamp) {
    if (timestamp - state.lastMoveTime > state.moveInterval && state.running) {
      step();
      state.lastMoveTime = timestamp;
    }

    draw();
    requestAnimationFrame(gameLoop);
  }

  function step() {
    state.direction = state.nextDirection;
    const nextHead = {
      x: state.snake[0].x + state.direction.x,
      y: state.snake[0].y + state.direction.y
    };

    if (hitWall(nextHead) || hitsSelf(nextHead)) {
      endGame();
      return;
    }

    state.snake.unshift(nextHead);
    state.colorOffset = (state.colorOffset + 1) % 3;

    if (nextHead.x === state.food.x && nextHead.y === state.food.y) {
      state.score += 1;
      scoreEl.textContent = state.score;
      statusEl.textContent = 'Mamma mia! Has devorado un cornetto.';
      spawnFood();
      accelerate();
    } else {
      state.snake.pop();
    }
  }

  function accelerate() {
    if (state.moveInterval > 80) {
      state.moveInterval -= 5;
    }
  }

  function hitWall(position) {
    return (
      position.x < 0 ||
      position.y < 0 ||
      position.x >= columns ||
      position.y >= rows
    );
  }

  function hitsSelf(position) {
    return state.snake.some((segment, index) => index !== 0 && segment.x === position.x && segment.y === position.y);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawArena();
    drawCornetto(state.food);
    drawSnake();
  }

  function drawArena() {
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = 'rgba(230, 214, 180, 0.35)';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, width * 0.46, height * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 4;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * (0.46 - i * 0.08), height * (0.38 - i * 0.06), 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(125, 84, 35, 0.35)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(width, i * tileSize);
      ctx.stroke();
    }
    for (let j = 0; j <= columns; j++) {
      ctx.beginPath();
      ctx.moveTo(j * tileSize, 0);
      ctx.lineTo(j * tileSize, height);
      ctx.stroke();
    }
  }

  function drawSnake() {
    const verde = colors.getPropertyValue('--verde-italia').trim();
    const bianco = colors.getPropertyValue('--bianco-italia').trim();
    const rosso = colors.getPropertyValue('--rosso-italia').trim();
    const palette = [verde, bianco, rosso];

    state.snake.forEach((segment, index) => {
      const px = segment.x * tileSize;
      const py = segment.y * tileSize;
      const stripeColor = palette[(index + state.colorOffset) % palette.length];

      ctx.fillStyle = stripeColor;
      ctx.fillRect(px, py, tileSize, tileSize);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);

      if (index === 0) {
        drawHeadDetails(px, py, stripeColor);
      }
    });
  }

  function drawHeadDetails(px, py, stripeColor) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    const eyeSize = tileSize * 0.18;
    ctx.beginPath();
    ctx.arc(px + tileSize * 0.25, py + tileSize * 0.35, eyeSize, 0, Math.PI * 2);
    ctx.arc(px + tileSize * 0.75, py + tileSize * 0.35, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = stripeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px + tileSize * 0.35, py + tileSize * 0.75);
    ctx.lineTo(px + tileSize * 0.65, py + tileSize * 0.75);
    ctx.stroke();
  }

  function drawCornetto(food) {
    const px = food.x * tileSize;
    const py = food.y * tileSize;
    const centerX = px + tileSize / 2;
    const centerY = py + tileSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(tileSize / 24, tileSize / 24);

    ctx.fillStyle = colors.getPropertyValue('--oro-cornetto').trim();
    ctx.beginPath();
    ctx.moveTo(-10, -6);
    ctx.quadraticCurveTo(-16, 0, -10, 6);
    ctx.quadraticCurveTo(0, 12, 10, 6);
    ctx.quadraticCurveTo(16, 0, 10, -6);
    ctx.quadraticCurveTo(0, -12, -10, -6);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = colors.getPropertyValue('--oro-oscuro').trim();
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.quadraticCurveTo(0, 0, -6, 4);
    ctx.moveTo(0, -5);
    ctx.quadraticCurveTo(6, 0, 0, 5);
    ctx.stroke();

    ctx.restore();
  }

  function endGame() {
    state.running = false;
    state.gameOver = true;
    statusEl.textContent = 'Finito! Chocaste dentro del Coliseo. Pulsa una flecha para intentarlo de nuevo.';
  }

  function changeDirection(x, y) {
    if (!state.running) {
      state.running = true;
      if (state.gameOver) {
        resetGame();
        state.running = true;
        statusEl.textContent = 'Forza! A devorar cornetos.';
      } else {
        statusEl.textContent = 'Forza! A devorar cornetos.';
      }
    }

    if (state.gameOver) {
      return;
    }

    const isOpposite = state.direction.x + x === 0 && state.direction.y + y === 0;
    if (!isOpposite) {
      state.nextDirection = { x, y };
    }
  }

  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        changeDirection(0, -1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        changeDirection(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        changeDirection(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        changeDirection(1, 0);
        break;
      case 'r':
      case 'R':
        resetGame();
        break;
      default:
        break;
    }
  });

  resetGame();
  requestAnimationFrame(gameLoop);
});
