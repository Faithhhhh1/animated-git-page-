const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const path = document.getElementById("textPath");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const pathLength = path.getTotalLength();
const hearts = [];
const HEART_COUNT = 500;

// Create heart particles
for (let i = 0; i < HEART_COUNT; i++) {
  hearts.push({
    offset: Math.random() * pathLength,
    speed: 0.5 + Math.random() * 1.5,
    size: 4 + Math.random() * 4
  });
}

function drawHeart(x, y, size) {
  ctx.save();
  ctx.translate(x, y);

  ctx.beginPath();

  ctx.moveTo(0, size);

  ctx.bezierCurveTo(
    size,
    -size,
    size * 2,
    size / 2,
    0,
    size * 2
  );

  ctx.bezierCurveTo(
    -size * 2,
    size / 2,
    -size,
    -size,
    0,
    size
  );

  ctx.fillStyle = "#ffd700";
  ctx.shadowColor = "#ffeb3b";
  ctx.shadowBlur = 20;

  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hearts.forEach((heart) => {
    heart.offset += heart.speed;

    if (heart.offset > pathLength) {
      heart.offset = 0;
    }

    const point = path.getPointAtLength(heart.offset);

    // tiny shimmer
    const x = point.x + (Math.random() - 0.5) * 2;
    const y = point.y + (Math.random() - 0.5) * 2;

    drawHeart(x, y, heart.size);
  });

  requestAnimationFrame(animate);
}

animate();
