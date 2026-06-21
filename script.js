const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

async function start() {
  // Load the SVG file
  const response = await fetch("assets/text.svg");
  const svgText = await response.text();

  document.getElementById("svg-container").innerHTML = svgText;

  // Find the first path in the SVG
  const path = document.querySelector("#svg-container path");

  if (!path) {
    throw new Error("No path found in assets/text.svg");
  }

  const pathLength = path.getTotalLength();

  const hearts = [];
  const HEART_COUNT = 800;

  for (let i = 0; i < HEART_COUNT; i++) {
    hearts.push({
      offset: Math.random() * pathLength,
      speed: 0.5 + Math.random() * 1.5,
      size: 2 + Math.random() * 2
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
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hearts.forEach((heart) => {
      heart.offset += heart.speed;

      if (heart.offset > pathLength) {
        heart.offset = 0;
      }

      const point = path.getPointAtLength(heart.offset);

      drawHeart(
        point.x,
        point.y,
        heart.size
      );
    });

    requestAnimationFrame(animate);
  }

  animate();
}

start().catch(console.error);
