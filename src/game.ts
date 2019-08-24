import { World } from '@jakeklassen/ecs';
import MainLoop from 'mainloop.js';
import { Transform2d } from './components/transform2d';
import { Vector2d } from './lib/vector2d';
import { Sprite } from './components/sprite';
import { RenderingSystem } from './systems/rendering-system';
import { DEG_TO_RAD, clamp } from './lib/math';
import { Velocity2d } from './components/velocity2d';
import { MovementSystem } from './systems/movement-system';
import { Rotator } from './components/rotator';
import { RotationSystem } from './systems/rotation-system';

type Cache = {
  [key: string]: CanvasImageSource;
};

const cache: Cache = {};

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

generateImages(cache);

const world = new World();

const player = world.createEntity();
const shipNavigator = world.createEntity();
const square = world.createEntity();

world.addEntityComponents(
  player,
  new Transform2d(new Vector2d(canvas.width / 2, canvas.height / 2)),
  new Sprite(cache.player),
);

world.addEntityComponents(
  shipNavigator,
  new Transform2d(new Vector2d(canvas.width / 2, canvas.height / 2)),
  new Sprite(cache.shipNavigator),
  new Velocity2d(0, 0),
  new Rotator(5),
);

world.addEntityComponents(
  square,
  new Transform2d(new Vector2d(0, canvas.height / 2)),
  new Sprite(cache.square),
  new Velocity2d(150, 0),
  new Rotator(5),
);

world.addSystem(new MovementSystem());
world.addSystem(new RotationSystem());
world.addSystem(new RenderingSystem(canvas));

// Used to create and store images
function generateImages(cache: Cache) {
  const bufferCanvas = document.createElement('canvas');
  bufferCanvas.width = 64;
  bufferCanvas.height = 64;

  const bufferCtx = bufferCanvas.getContext('2d')!;
  bufferCtx.imageSmoothingEnabled = false;
  bufferCtx.globalCompositeOperation = 'lighter';
  bufferCtx.shadowColor = 'red';
  bufferCtx.shadowBlur = 6;

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

MainLoop.setUpdate((dt: number) => {
  world.updateSystems(dt / 1000);
}).start();
