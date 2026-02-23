import * as PIXI from "pixi.js";
import { $ } from "jquery";

// Get current mouse position and transfer it to grid system
let mousePosition = new PIXI.Point(-1, -1);
$(document).mousemove((e) => {
  mousePosition.x = e.pageX - (e.pageX % 20);
  mousePosition.y = e.pageY - (e.pageY % 20);
});

// Constants etc.
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

// Wire
let currentWireTicker: PIXI.Ticker = null;
let flipped = false;
$(window).on("keydown", (e) => {
  var code = e.keycode || e.which;
  if (code === 82) {
    flipped = !flipped;
    console.log(flipped);
  }
});

$(window).on("click", () => {
  if (CurrentAction === ACTIONS.Wire) {
    currentlyDrawing = !currentlyDrawing;
    if (currentlyDrawing) {
      const wireTicker = new PIXI.Ticker();
      currentWireTicker = wireTicker;
      drawWire(wireTicker);
    } else {
      currentWireTicker.destroy();
    }
  }
});

function drawWire(wireTicker: PIXI.Ticker) {
  let wireStart = new PIXI.Point(mousePosition.x, mousePosition.y);
  const wireGraphics = new PIXI.Graphics();

  wireTicker.add((time) => {
    if (currentlyDrawing && CurrentAction === ACTIONS.Wire) {
      wireGraphics.clear();
      const width = mousePosition.x - wireStart.x;
      const height = mousePosition.y - wireStart.y;
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
}
