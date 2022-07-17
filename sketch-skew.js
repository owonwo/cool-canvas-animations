const canvasSketch = require("canvas-sketch");
const { color } = require("canvas-sketch-util");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const { range } = require("ramda");
const risoColors = require('riso-colors');

const settings = {
  dimensions: 'A4',
};

const sketch = ({ context, width, height }) => {
  let x, y, w, h, fill, stroke;
  let nums = 1

  const colors = range(0, 3).map(e => random.pick(risoColors).hex);
  const rects = []

  for (let i = 0; i < nums; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(200, 600);
    h = random.range(10, 160);
    fill = random.pick(colors);
    strokeColor = random.pick(colors);
    blend = random.value() ? 'overlay' : 'source-over';

    rects.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white"
    context.fillRect(0, 0, width, height);

    for (let { x, y, w, h, stroke, fill, blend } of rects) {
        context.save();
        context.translate(x, y);
        context.fillStyle = fill;
        context.strokeStyle = stroke;
        context.lineWidth = random.rangeFloor(3, 15);
        // context.globalCompositeOperation = 'source-over';

        drawSkewRectangle({ context, width: w, height: h });

        let shadowColor = color.offsetHSL(fill, 0, 0, 0).rgba;
        shadowColor[3] = 0.3;

        context.shadowOffsetX = -20;
        context.shadowOffsetY = 20;
        context.shadowColor = color.style(shadowColor);
       
        context.fill();

        context.shadowColor = 'transparent';

        context.stroke();
        
        // context.globalCompositeOperation = blend
        // context.lineWidth = 2;
        // context.strokeWidth = 1;
        

        context.restore();
    }
  };
};

const drawPaperSlides = ({ context, count = 6, degrees }) => {
  Array.from(Array(count)).forEach((_, i) => {
    const i_ = 360 / 2 / count;
    const iDeg = degrees + i_ * i;

    drawSkewRectangle({
      context,
      degrees: iDeg,
    });
  });
};

const drawSkewRectangle = ({
  context,
  width = 600,
  height = 100,
  degrees = -200,
}) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * width;
  const ry = Math.sin(angle) * width;

  context.translate(rx * -0.5, (ry + height) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + height);
  context.lineTo(0, height);
  context.closePath();
};

canvasSketch(sketch, settings);
