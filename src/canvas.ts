import * as PIXI from "pixi.js";
import { $ } from "jquery";

// Get current mouse position
let mousePosition : PIXI.Point = new PIXI.Point(-1, -1);
$(document).mousemove((e) => {
    mousePosition.x = e.pageX;
    mousePosition.y = e.pageY;
})

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
        const corner = (i % cornerIncrements == 0 && e % cornerIncrements == 0);
        if (!corner) {
            bgGraphics.circle(20*e + 10, 20*i + 10, 2.5);
            bgGraphics.fill({ r: 0, g: 0, b: 0, a: 0.1 });
        } else {
            bgGraphics.circle(20 * e + 10, 20 * i + 10, 3);
            bgGraphics.fill({ r: 0, g: 0, b: 0, a: 0.2 });
        }
    }
}

app.stage.addChild(bgGraphics);

// Wire
let wireStart : PIXI.Point = null;
const wireGraphics = new PIXI.Graphics();

$(window).on('click', () => {
    if (CurrentAction === ACTIONS.Wire) {
        currentlyDrawing = !currentlyDrawing;
        if (currentlyDrawing && wireStart == null) {
            wireStart = new PIXI.Point(0, 0);
        }
    }
})

app.ticker.add((time) => {
    if (currentlyDrawing && CurrentAction === ACTIONS.Wire) {
        wireGraphics.roundRect(mousePosition.x, mousePosition.y, 15, 15, 20);
        wireGraphics.fill(0x35cc5a);
    }
});

app.stage.addChild(wireGraphics);
