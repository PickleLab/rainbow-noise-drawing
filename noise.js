const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Color = require("canvas-sketch-util/color");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 6,
  rows: 6,
  scaleMin: 10,
  scaleMax: 30,
  freq: 0.001,
  colorFreq: 0.005,
  amp: 0.2,
  frame: 0,
  animate: true,
};

const rainbow = (n) => {
  n = (n * 240) / 255;
  return `hsl(${n},94%,64%)`;
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const { cols, rows } = params;
    const numCells = cols * rows;

    const gridw = width * 0.75;
    const gridh = height * 0.75;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;

      const noise = random.noise3D(x, y, frame * 10, params.freq);

      const angle = noise * Math.PI * params.amp;

      const scale = math.mapRange(noise, -1, 1, params.scaleMin, params.scaleMax);
      const colorRange = math.mapRange(noise, -1, 1, 0, 240);

      context.strokeStyle = Color.parse(rainbow(colorRange)).hex;

      const translate = {
        x: x + margx + cellw * 0.5,
        y: y + margy + cellh * 0.5,
      };

      context.save();
      context.lineWidth = scale;
      context.translate(translate.x, translate.y);
      context.rotate(angle);

      context.lineCap = "round";

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();

      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
