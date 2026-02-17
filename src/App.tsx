import { Stage, Text } from "@pixi/react";
import { TextStyle, Ticker } from "pixi.js";
import { useRef, useEffect, useState } from "react";
import Viewport from "./Viewport";
import useWindowDimensions from "./UseWindowDimensions";

function App() {
  const style = new TextStyle({
    fill: "#ffffff",
    fontSize: 36,
    fontFamily: "Arial",
    fontWeight: "bold",
  });

  const { height, width } = useWindowDimensions();

  return (
    <Stage width={width} height={height}>
      <Viewport width={width} height={height}>
        <ClickMe
          text="Click Me :)"
          style={style}
          anchor={0.5}
          x={width / 2}
          y={height / 2}
        />
      </Viewport>
    </Stage>
  );
}

type ClickMeProps = {
  text: string;
  style: TextStyle;
  anchor: number;
  x: number;
  y: number;
};

const ClickMe = ({ text, style, anchor, x, y }: ClickMeProps) => {
  const [alpha, setAlpha] = useState(1);
  const fading = useRef(false);

  useEffect(() => {
    const ticker = new Ticker();

    ticker.add((delta) => {
      if (!fading.current) return;

      setAlpha((a) => Math.max(0, a - 0.01 * delta));
    });

    ticker.start();

    return () => ticker.stop();
  }, []);

  const clicked = () => {
    fading.current = true;
  };

  return (
    <Text
      text={text}
      style={style}
      anchor={anchor}
      x={x}
      y={y}
      alpha={alpha}
      interactive
      pointerdown={clicked}
    />
  );
};

export default App;
