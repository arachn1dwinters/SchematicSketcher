import * as PIXI from "pixi.js";
import { $ } from "jquery";

let body = document.body, html = document.documentElement;
const height = $(window).height();
const width = $(window).width();

const app = new PIXI.Application();

await app.init({
    background: "#ffffea",
    resizeTo: window,
    antialias: true,
});

document.body.appendChild(app.canvas);

// Animate
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
});

// Draw grid of dots
const graphics = new PIXI.Graphics();

for (let i = 0; i < 100; i++) {
    for (let e = 0; e < 100; e++) {
        const cornerIncrements = 5;
        const corner = (i % cornerIncrements == 0 && e % cornerIncrements == 0);
        if (!corner) {
            graphics.circle(20*e + 10, 20*i + 10, 2.5);
            graphics.fill({ r: 0, g: 0, b: 0, a: 0.1 });
        } else {
            graphics.circle(20 * e + 10, 20 * i + 10, 3);
            graphics.fill({ r: 0, g: 0, b: 0, a: 0.2 });
        }
    }
}

app.stage.addChild(graphics);
