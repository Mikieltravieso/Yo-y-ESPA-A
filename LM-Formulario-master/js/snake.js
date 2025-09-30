document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const statusEl = document.getElementById('status');

  const tileSize = 24;
  const columns = Math.floor(canvas.width / tileSize);
  const rows = Math.floor(canvas.height / tileSize);
  const colors = getComputedStyle(document.documentElement);

  const sandGrains = Array.from({ length: 160 }, () => ({
    x: Math.random() - 0.5,
    y: Math.random() - 0.5,
    radiusX: Math.random() * 2.6 + 0.4,
    radiusY: Math.random() * 0.8 + 0.2,
    rotation: Math.random() * Math.PI
  }));

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

    drawStands(width, height, centerX, centerY);
    drawSunlight(centerX, centerY, width, height);
    drawArenaFloor(centerX, centerY, width, height);
    drawInnerDetails(centerX, centerY, width, height);
    drawFlagBanners(centerX, width, height);
  }

  function drawStands(width, height, centerX, centerY) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(48, 30, 17, 0.92)');
    gradient.addColorStop(0.35, 'rgba(73, 47, 27, 0.94)');
    gradient.addColorStop(0.65, 'rgba(107, 74, 47, 0.9)');
    gradient.addColorStop(1, 'rgba(150, 110, 70, 0.85)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    for (let ring = 0; ring < 4; ring++) {
      ctx.lineWidth = 6 - ring;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - height * 0.28 + ring * 18, width * (0.52 + ring * 0.04), height * (0.32 + ring * 0.04), 0, 0, Math.PI);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    const archCount = 28;
    for (let i = 0; i < archCount; i++) {
      const angle = (-Math.PI / 1.1) + (i / (archCount - 1)) * (Math.PI / 1.1) * 2;
      const x = centerX + Math.cos(angle) * width * 0.45;
      const y = centerY - height * 0.32 + Math.sin(angle) * height * 0.18;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(angle) * 0.35);
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-10, -34);
      ctx.quadraticCurveTo(0, -48, 10, -34);
      ctx.lineTo(10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawSunlight(centerX, centerY, width, height) {
    ctx.save();
    const lightGradient = ctx.createRadialGradient(centerX - width * 0.1, centerY - height * 0.45, width * 0.05, centerX - width * 0.05, centerY, width * 0.65);
    lightGradient.addColorStop(0, 'rgba(255, 240, 210, 0.45)');
    lightGradient.addColorStop(0.3, 'rgba(255, 233, 190, 0.32)');
    lightGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lightGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function drawArenaFloor(centerX, centerY, width, height) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, width * 0.48, height * 0.36, 0, 0, Math.PI * 2);
    ctx.clip();

    const sandGradient = ctx.createRadialGradient(centerX, centerY, width * 0.05, centerX, centerY, width * 0.45);
    sandGradient.addColorStop(0, 'rgba(255, 238, 200, 0.95)');
    sandGradient.addColorStop(0.5, 'rgba(233, 197, 140, 0.9)');
    sandGradient.addColorStop(1, 'rgba(202, 160, 104, 0.92)');

    ctx.fillStyle = sandGradient;
    ctx.fillRect(centerX - width * 0.5, centerY - height * 0.5, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    sandGrains.forEach(grain => {
      ctx.beginPath();
      ctx.ellipse(
        centerX + grain.x * width * 0.45,
        centerY + grain.y * height * 0.45,
        grain.radiusX,
        grain.radiusY,
        grain.rotation,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    ctx.restore();

    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(92, 58, 33, 0.8)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, width * 0.48, height * 0.36, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawInnerDetails(centerX, centerY, width, height) {
    ctx.save();
    const ringCount = 3;
    for (let i = 1; i <= ringCount; i++) {
      ctx.lineWidth = 4 - i * 0.6;
      ctx.strokeStyle = `rgba(93, 63, 38, ${0.55 - i * 0.12})`;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, width * (0.42 - i * 0.07), height * (0.31 - i * 0.06), 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
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
    ctx.restore();
  }

  function drawFlagBanners(centerX, width, height) {
    ctx.save();
    ctx.translate(centerX, height * 0.08);
    const bannerCount = 5;
    const spacing = width * 0.18;
    for (let i = -Math.floor(bannerCount / 2); i <= Math.floor(bannerCount / 2); i++) {
      const offsetY = Math.sin(i * 0.8) * 6;
      const left = i * spacing - spacing / 2;

      ctx.save();
      ctx.translate(left, offsetY);
      ctx.rotate(Math.sin(i * 0.6) * 0.12);
      const flagWidth = 46;
      const flagHeight = 24;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fillRect(-flagWidth / 2 + 3, 10, flagWidth, 8);

      ctx.fillStyle = '#1c1208';
      ctx.fillRect(-flagWidth / 2 - 2, -flagHeight - 2, flagWidth + 4, flagHeight + 4);

      ctx.fillStyle = '#008c45';
      ctx.fillRect(-flagWidth / 2, -flagHeight, flagWidth / 3, flagHeight);
      ctx.fillStyle = '#f4f5f0';
      ctx.fillRect(-flagWidth / 2 + flagWidth / 3, -flagHeight, flagWidth / 3, flagHeight);
      ctx.fillStyle = '#cd212a';
      ctx.fillRect(-flagWidth / 2 + (flagWidth / 3) * 2, -flagHeight, flagWidth / 3, flagHeight);

      ctx.restore();
    }
    ctx.restore();
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
      drawSnakeSegment(px, py, stripeColor, index === 0);
    });
  }

  function drawSnakeSegment(px, py, stripeColor, isHead) {
    ctx.save();
    const segmentGradient = ctx.createLinearGradient(px, py, px, py + tileSize);
    segmentGradient.addColorStop(0, shadeColor(stripeColor, 18));
    segmentGradient.addColorStop(0.45, stripeColor);
    segmentGradient.addColorStop(1, shadeColor(stripeColor, -18));
    ctx.fillStyle = segmentGradient;
    ctx.beginPath();
    drawRoundedRectPath(px + 1, py + 1, tileSize - 2, tileSize - 2, 6);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    drawRoundedRectPath(px + 1, py + 1, tileSize - 2, tileSize - 2, 6);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    drawRoundedRectPath(px + 3, py + 3, tileSize - 10, tileSize / 2.2, 4);
    ctx.fill();

    if (isHead) {
      drawHeadDetails(px, py, stripeColor);
    }
    ctx.restore();
  }

  function drawHeadDetails(px, py, stripeColor) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    const eyeSize = tileSize * 0.18;
    ctx.beginPath();
    ctx.arc(px + tileSize * 0.3, py + tileSize * 0.35, eyeSize, 0, Math.PI * 2);
    ctx.arc(px + tileSize * 0.7, py + tileSize * 0.35, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(px + tileSize * 0.27, py + tileSize * 0.32, eyeSize / 3, 0, Math.PI * 2);
    ctx.arc(px + tileSize * 0.67, py + tileSize * 0.32, eyeSize / 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = shadeColor(stripeColor, -20);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px + tileSize * 0.35, py + tileSize * 0.75);
    ctx.lineTo(px + tileSize * 0.65, py + tileSize * 0.75);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(180, 40, 40, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + tileSize * 0.5, py + tileSize * 0.8);
    ctx.lineTo(px + tileSize * 0.5, py + tileSize * 0.95);
    ctx.stroke();
  }

  function shadeColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function drawRoundedRectPath(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
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
    ctx.quadraticCurveTo(-16, 2, -10, 8);
    ctx.quadraticCurveTo(0, 14, 12, 8);
    ctx.quadraticCurveTo(18, 0, 10, -8);
    ctx.quadraticCurveTo(0, -14, -10, -6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-2, -4, 6, 2.2, Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(4, 2, 5.2, 1.8, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = colors.getPropertyValue('--oro-oscuro').trim();
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.quadraticCurveTo(0, 0, -6, 4);
    ctx.moveTo(0, -5);
    ctx.quadraticCurveTo(6, 0, 0, 5);
    ctx.moveTo(6, -3);
    ctx.quadraticCurveTo(10, 2, 6, 5);
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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowUp':
        changeDirection(0, -1);
        break;
      case 'ArrowDown':
        changeDirection(0, 1);
        break;
      case 'ArrowLeft':
        changeDirection(-1, 0);
        break;
      case 'ArrowRight':
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
