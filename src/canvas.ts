import * as PIXI from "pixi.js";
import { $ } from "jquery";

let body = document.body, html = document.documentElement;
const height = $(window).height();
const width = $(window).width();

const app = new PIXI.Application();

await app.init({
    background: "#ffffea",
    resizeTo: window,
});

document.body.appendChild(app.canvas);

// Load the texture FIRST
const texture = await PIXI.Assets.load('/sample.png');

// Then create sprite from the loaded texture
let basicText = new PIXI.Text({
    text: 'Hello Pixi!',
    style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xff1010,
        align: 'center',
    }
});
app.stage.addChild(basicText);

// Animate
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    basicText.rotation += 0.1 * delta.deltaTime;
});
