import * as PIXI from "pixi.js";
import { $ } from "jquery";

// Get current mouse position and transfer it to grid system
let mousePosition = new PIXI.Point(-1, -1);
$(document).mousemove((e) => {
  mousePosition.x = e.pageX - (e.pageX % 20);
  mousePosition.y = e.pageY - (e.pageY % 20);
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

class Wire {
  horizontalStart: PIXI.Point;
  verticalStart: PIXI.Point;
  width: number;
  height: number;
  pointsFilled: PIXI.Point[];

  constructor(
    horizontalStart: PIXI.Point,
    verticalStart: PIXI.Point,
    width: number,
    height: number,
    pointsFilled: PIXI.Point[],
  ) {
    this.horizontalStart = horizontalStart;
    this.verticalStart = verticalStart;
    this.width = width;
    this.height = height;
    this.pointsFilled = pointsFilled;
  }
}

const wires: Wire[] = [];
const wiredPoints: PIXI.Point[] = [];

let flipped = false;
$(window).on("keydown", (e) => {
  var code = e.keycode || e.which;
  if (code === 82) {
    // "r" pressed
    flipped = !flipped;
  }
});

let currentWireTicker: PIXI.Ticker;
let currentWidth: number;
let currentHeight: number;
let currentHorizontalStart: PIXI.Point;
let currentVerticalStart: PIXI.Point;
let currentPointsFilled: PIXI.Point[] = [];
let currentWireGraphics: PIXI.Graphics;

$(window).on("click", () => {
  if (CurrentAction === ACTIONS.Wire) {
    currentlyDrawing = !currentlyDrawing;
    if (currentlyDrawing) {
      const wireTicker = new PIXI.Ticker();
      currentWireTicker = wireTicker;
      currentWireGraphics = drawWire(wireTicker);
    } else {
      for (let i = 0; i < wires.length; i++) {
        const wire = wires[i];

        for (let e = 0; e < currentPointsFilled.length; e++) {
          const pointOnWire = currentPointsFilled[e];
          const contains = pointsListContains(wire.pointsFilled, pointOnWire);
          if (contains) {
            currentWireGraphics.circle(pointOnWire.x, pointOnWire.y, 10);
            currentWireGraphics.fill(0x35cc5a);
          }
        }
      }

      wires.push(
        new Wire(
          currentHorizontalStart,
          currentVerticalStart,
          currentWidth,
          currentHeight,
          currentPointsFilled,
        ),
      );
      currentWireTicker.destroy();
      currentWidth = null;
      currentHeight = null;
      currentHorizontalStart = null;
      currentVerticalStart = null;
      currentPointsFilled = [];
    }
  }
});

function drawWire(wireTicker: PIXI.Ticker) {
  let wireStart = new PIXI.Point(mousePosition.x, mousePosition.y);
  const wireGraphics = new PIXI.Graphics();

  wireTicker.add((time) => {
    if (currentlyDrawing && CurrentAction === ACTIONS.Wire) {
      const contains = pointsListContains(currentPointsFilled, mousePosition);
      if (!contains) {
        currentPointsFilled.push(new PIXI.Point(mousePosition.x, mousePosition.y));
      }

      wireGraphics.clear();
      const width = mousePosition.x - wireStart.x;
      currentWidth = width;
      const height = mousePosition.y - wireStart.y;
      currentHeight = height;
      const thickness = 10;
      // Draw horizontal
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
      // Draw vertical
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
      wireGraphics.fill(0x35cc5a);
    }
  });
  wireTicker.start();

  app.stage.addChild(wireGraphics);
  return wireGraphics;
}

function pointsListContains(pointsList: PIXI.Point[], checkPoint: PIXI.Point) {
  for (let i = 0; i < pointsList.length; i++) {
    const point = pointsList[i];
    if (point.x === checkPoint.x && point.y === checkPoint.y) {
      return true;
    }
  }
  return false;
}

function getWirePoints(
  wireStart: PIXI.Point,
  width: number,
  height: number,
  flipped: boolean,
  gridSize: number = 20
): PIXI.Point[] {
  const points: PIXI.Point[] = [];

  const hStart = flipped ? wireStart : new PIXI.Point(wireStart.x, wireStart.y + height);
  const vStart = flipped ? new PIXI.Point(wireStart.x + width, wireStart.y) : wireStart;

  // All horizontal points
  const hSteps = Math.abs(width) / gridSize;
  for (let i = 0; i <= hSteps; i++) {
    points.push(new PIXI.Point(
      hStart.x + (width >= 0 ? i : -i) * gridSize,
      hStart.y
    ));
  }

  // All vertical points
  const vSteps = Math.abs(height) / gridSize;
  for (let i = 0; i <= vSteps; i++) {
    points.push(new PIXI.Point(
      vStart.x,
      vStart.y + (height >= 0 ? i : -i) * gridSize
    ));
  }

  return points;
}
