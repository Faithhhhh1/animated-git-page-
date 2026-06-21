const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

async function start() {
  try {
    const response = await fetch("./assets/text.svg");

    if (!response.ok) {
      throw new Error("Cannot load text.svg");
    }

    const svgText = await response.text();

    const container = document.getElementById("svg-container");
    container.innerHTML = svgText;

    const paths = [
      ...container.querySelectorAll("path")
    ];

    if (!paths.length) {
      throw new Error("No paths found in text.svg");
    }

    const hearts = [];

    paths.forEach((path) => {
      const length = path.getTotalLength();

      for (let i = 0; i < 150; i++) {
        hearts.push({
          path,
          length,
          offset: Math.random() * length,
          speed: 0.5 + Math.random(),
          size: 2 + Math.random() * 2
        });
      }
    });

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
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      hearts.forEach((heart) => {
        heart.offset += heart.speed;

        if (heart.offset > heart.length) {
          heart.offset = 0;
        }

        const p =
          heart.path.getPointAtLength(
            heart.offset
          );

        drawHeart(
          p.x,
          p.y,
          heart.size
        );
      });

      requestAnimationFrame(animate);
    }

    animate();
  } catch (err) {
    console.error(err);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText(
      err.message,
      40,
      60
    );
  }
}

start();
