const DEG_TO_RAD = Math.PI / 180;
const cache: { [key: string]: CanvasImageSource } = {};

let mouse = { x: 0, y: 0 };

const clamp = (number: number, min: number, max: number) =>
  Math.max(min, Math.min(number, max));

// Setup the main canvas
const canvas = document.getElementById('mainCanvas')! as HTMLCanvasElement;
canvas.style.position = 'absolute';
canvas.style.border = 'thick solid lightGray';
// Scale with css!
canvas.style.width = `${1024}px`;
canvas.style.height = `${768}px`;
canvas.style.left =
  window.innerWidth / 2 - parseInt(canvas.style.width) / 2 + 'px';
canvas.style.top =
  window.innerHeight / 2 - parseInt(canvas.style.height) / 2 + 'px';

// Listeners
canvas.onmousemove = onMouseMove;

// Buffer canvas
// Used to generate and save our entities
const bufferCanvas = document.createElement('canvas');
bufferCanvas.width = 64;
bufferCanvas.height = 64;
bufferCanvas.style.position = 'absolute';
bufferCanvas.style.border = 'thick solid lightGray';
bufferCanvas.style.left = bufferCanvas.style.top = '0px';

bufferCanvas.onclick = function() {
  window.open(
    bufferCanvas.toDataURL(),
    'canvas image',
    'left=0,top=0,width=' +
      bufferCanvas.width +
      ',height=' +
      bufferCanvas.height +
      ',toolbar=0, resizable=0',
  );

  return false;
};

// Contexts
const ctx = canvas.getContext('2d', { alpha: false })!;
ctx.imageSmoothingEnabled = true;

const bufferCtx = bufferCanvas.getContext('2d')!;
bufferCtx.imageSmoothingEnabled = false;
bufferCtx.globalCompositeOperation = 'lighter';
bufferCtx.shadowColor = 'red';
bufferCtx.shadowBlur = 6;

document.body.appendChild(bufferCanvas);

generateImages();

const player = cache.player as CanvasImageSource;
const shipNav = cache.shipNavigator;
const square = cache.square;

let time = 0;
let pastTime = performance.now();
let dt = 0;

function frame(hrt: DOMHighResTimeStamp) {
  requestAnimationFrame(frame);

  // In seconds
  dt = (hrt - pastTime) / 1000;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'normal';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px Visitor';
  ctx.fillText(`Mouse: ${mouse.x}, ${mouse.y}`, 10, 20);

  ctx.globalCompositeOperation = 'lighter';
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.drawImage(
    player,
    -player.width / 2,
    -player.height / 2,
    player.width as number,
    player.height as number,
  );

  // Rotate navigator to look at mouse
  let targetX = mouse.x - canvas.width / 2,
    targetY = mouse.y - canvas.height / 2,
    rotation = Math.atan2(targetY, targetX);

  ctx.rotate(rotation);
  ctx.drawImage(
    shipNav,
    -shipNav.width / 2,
    -shipNav.height / 2,
    shipNav.width as number,
    shipNav.height as number,
  );
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.translate(hrt / 10, canvas.height / 2);
  ctx.rotate(hrt * 0.1);

  ctx.drawImage(
    square,
    -square.width / 2,
    -square.height / 2,
    square.width as number,
    square.height as number,
  );

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  pastTime = hrt;
}

requestAnimationFrame(frame);

// Used to create and store images
function generateImages() {
  // Square
  bufferCtx.globalAlpha = 0.5;
  bufferCtx.strokeStyle = 'white';
  bufferCtx.lineWidth = 5;
  bufferCtx.strokeRect(15, 15, 34, 34);

  // Overlay
  bufferCtx.globalAlpha = 0.8;
  bufferCtx.strokeStyle = 'blue';
  bufferCtx.lineWidth = 8;
  bufferCtx.strokeRect(15, 15, 34, 34);

  cache.square = new Image();
  cache.square.src = bufferCanvas.toDataURL();

  bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

  // Ship base
  bufferCtx.globalAlpha = 0.5;
  bufferCtx.strokeStyle = 'white';
  bufferCtx.lineWidth = 3;
  bufferCtx.beginPath();
  bufferCtx.arc(32, 32, 18, 0, Math.PI * 2, true);
  bufferCtx.stroke();

  // Ship overlay
  bufferCtx.globalAlpha = 0.8;
  bufferCtx.strokeStyle = 'green';
  bufferCtx.lineWidth = 8;
  bufferCtx.beginPath();
  bufferCtx.arc(32, 32, 18, 0, Math.PI * 2, true);
  bufferCtx.stroke();

  cache.player = new Image();
  cache.player.src = bufferCanvas.toDataURL();

  bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

  // Navigator
  const startAngle = 0;

  bufferCtx.strokeStyle = 'teal';
  bufferCtx.save();
  bufferCtx.lineWidth = 3;
  bufferCtx.beginPath();
  //bufferCtx.arc(32, 32, 22,  startAngle - 135 * Math.PI / 180, startAngle - 45 * Math.PI / 180, false);
  bufferCtx.arc(
    32,
    32,
    22,
    startAngle - 45 * DEG_TO_RAD,
    startAngle + 45 * DEG_TO_RAD,
    false,
  );
  bufferCtx.stroke();

  // Navigator overlay
  bufferCtx.strokeStyle = 'lightBlue';
  bufferCtx.lineWidth = 3;
  bufferCtx.beginPath();
  bufferCtx.arc(
    32,
    32,
    22,
    startAngle - 45 * DEG_TO_RAD,
    startAngle + 45 * DEG_TO_RAD,
    false,
  );
  bufferCtx.stroke();
  bufferCtx.restore();

  cache.shipNavigator = new Image();
  cache.shipNavigator.src = bufferCanvas.toDataURL();

  bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
}

function onMouseMove(e: MouseEvent) {
  var computedStyle = window.getComputedStyle(e.target as Element, null);
  var topBorder = parseInt(
    computedStyle.getPropertyValue('border-top-width'),
    10,
  );
  var leftBorder = parseInt(
    computedStyle.getPropertyValue('border-left-width'),
    10,
  );
  var rect = (e.target as Element).getBoundingClientRect();
  var pos = {
    x: clamp(
      e.clientX - rect.left - leftBorder,
      0,
      parseFloat((e.target as Element).getAttribute('width')!),
    ),
    y: clamp(
      e.clientY - rect.top - topBorder,
      0,
      parseFloat((e.target as Element).getAttribute('height')!),
    ),
  };

  mouse = pos;
}

export var game = {
  name: 'Canvas Game',
};
