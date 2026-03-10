import * as PIXI from "pixi.js";
import { $ } from "jquery";

// Get current mouse position and transfer it to grid system
let mousePosition = new PIXI.Point(-1, -1);
$(document).mousemove((e) => {
  mousePosition.x = e.pageX - (e.pageX % 20);
  mousePosition.y = e.pageY - (e.pageY % 20) - 38.5;
});

// Potential user actions
enum ACTIONS {
  Wire,
  Part,
  Select,
}

let CurrentAction: ACTIONS = ACTIONS.Wire;
let currentlyDrawing = false;

const app = new PIXI.Application();

await app.init({
  background: "#ffffea",
  resizeTo: window,
  antialias: true,
});

document.body.appendChild(app.canvas);

// Draw grid of dots
const bgGraphics = new PIXI.Graphics();
bgGraphics.cullable = true;

for (let i = 0; i < 100; i++) {
  for (let e = 0; e < 100; e++) {
    const cornerIncrements = 5;
    const corner = i % cornerIncrements == 0 && e % cornerIncrements == 0;
    if (!corner) {
      bgGraphics.circle(20 * e + 5, 20 * i + 5, 2.5);
      bgGraphics.fill({ r: 0, g: 0, b: 0, a: 0.1 });
    } else {
      bgGraphics.circle(20 * e + 5, 20 * i + 5, 3);
      bgGraphics.fill({ r: 0, g: 0, b: 0, a: 0.2 });
    }
  }
}

app.stage.addChild(bgGraphics);

// Wires
enum WireDirection {
  Horizontal,
  Vertical,
}

interface wirePoint {
  position: PIXI.Point;
  direction: WireDirection;
  end: boolean;
}

class Wire {
  horizontalStart: PIXI.Point;
  verticalStart: PIXI.Point;
  width: number;
  height: number;
  pointsFilled: wirePoint[];

  constructor(
    horizontalStart: PIXI.Point,
    verticalStart: PIXI.Point,
    width: number,
    height: number,
    pointsFilled: wirePoint[],
  ) {
    this.horizontalStart = horizontalStart;
    this.verticalStart = verticalStart;
    this.width = width;
    this.height = height;
    this.pointsFilled = pointsFilled;
  }
}

const wires: Wire[] = [];

let flipped = false;
$(window).on("keydown", (e) => {
  var code = e.keycode || e.which;
  if (code === 82) {
    flipped = !flipped;
  }
});

let currentWireTicker: PIXI.Ticker;
let currentWidth: number;
let currentHeight: number;
let currentHorizontalStart: PIXI.Point;
let currentVerticalStart: PIXI.Point;
let currentWireGraphics: PIXI.Graphics;
let wireStart: PIXI.Point;

function getWirePoints(
  wireStart: PIXI.Point,
  width: number,
  height: number,
  flipped: boolean,
  gridSize: number = 20
): wirePoint[] {
  const points: wirePoint[] = [];

  const hStart = flipped ? wireStart : new PIXI.Point(wireStart.x, wireStart.y + height);
  const vStart = flipped ? new PIXI.Point(wireStart.x + width, wireStart.y) : wireStart;

  const hSteps = Math.abs(width) / gridSize;
  for (let i = 0; i <= hSteps; i++) {
    points.push( {
      position: new PIXI.Point(
        hStart.x + (width >= 0 ? i : -i) * gridSize,
        hStart.y
      ),
      direction: WireDirection.Horizontal,
      end: i === 0 || i === hSteps,
    });
  }

  const vSteps = Math.abs(height) / gridSize;
  for (let i = 0; i <= vSteps; i++) {
    points.push({ 
      position: new PIXI.Point(
        vStart.x,
        vStart.y + (height >= 0 ? i : -i) * gridSize
      ),
      direction: WireDirection.Vertical,
      end: i === 0 || i === vSteps,
    });
  }

  return points;
}

$(window).on("click", () => {
  if (CurrentAction === ACTIONS.Wire) {
    currentlyDrawing = !currentlyDrawing;
    if (currentlyDrawing) {
      wireStart = new PIXI.Point(mousePosition.x, mousePosition.y);
      const wireTicker = new PIXI.Ticker();
      currentWireTicker = wireTicker;
      currentWireGraphics = drawWire(wireTicker);
    } else {
      const finalizedPoints = getWirePoints(wireStart, currentWidth, currentHeight, flipped);

      for (const wire of wires) {
        for (const point of finalizedPoints) {
          if (intersectingPoints(wire.pointsFilled, point)) {
            currentWireGraphics.circle(point.position.x + 3, point.position.y + 3, 8);
            currentWireGraphics.fill(0x222021);
          }
        }
      }

      wires.push(
        new Wire(
          currentHorizontalStart,
          currentVerticalStart,
          currentWidth,
          currentHeight,
          finalizedPoints,
        ),
      );
      currentWireTicker.destroy();
      currentWidth = 0;
      currentHeight = 0;
      currentHorizontalStart = new PIXI.Point(-1, -1);
      currentVerticalStart = new PIXI.Point(-1, -1);
    }
  }
});

function drawWire(wireTicker: PIXI.Ticker) {
  const wireGraphics = new PIXI.Graphics();

  wireTicker.add(() => {
    if (currentlyDrawing && CurrentAction === ACTIONS.Wire) {
      wireGraphics.clear();
      const width = mousePosition.x - wireStart.x;
      currentWidth = width;
      const height = mousePosition.y - wireStart.y;
      currentHeight = height;
      const thickness = 6;
      const horizontalWireStart = flipped
        ? wireStart
        : new PIXI.Point(wireStart.x, mousePosition.y);
      if (width > 0) {
        wireGraphics.roundRect(
          horizontalWireStart.x,
          horizontalWireStart.y,
          width + thickness,
          thickness,
          20,
        );
      } else {
        wireGraphics.roundRect(
          horizontalWireStart.x + width,
          horizontalWireStart.y,
          Math.abs(width) + (!flipped ? thickness : 0),
          thickness,
          20,
        );
      }
      const verticalWireStart = flipped
        ? new PIXI.Point(wireStart.x + width, wireStart.y)
        : wireStart;
      if (height > 0) {
        wireGraphics.roundRect(
          verticalWireStart.x,
          verticalWireStart.y,
          thickness,
          height + (!flipped ? thickness : 0),
          20,
        );
      } else {
        wireGraphics.roundRect(
          verticalWireStart.x,
          verticalWireStart.y + height + (flipped ? thickness : 0),
          thickness,
          Math.abs(height),
          20,
        );
      }
      wireGraphics.fill(0x222021);
    }
  });
  wireTicker.start();

  app.stage.addChild(wireGraphics);
  return wireGraphics;
}

function intersectingPoints(pointsList: wirePoint[], checkPoint: wirePoint) {
  for (let i = 0; i < pointsList.length; i++) {
    const point = pointsList[i];
    if (point.position.x === checkPoint.position.x
        && point.position.y === checkPoint.position.y
        && point.direction !== checkPoint.direction
        && !(point.end && checkPoint.end)) {
      return true;
      console.log("hello");
    }
  }
  return false;
}
