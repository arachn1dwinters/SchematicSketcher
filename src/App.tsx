import { Stage, Text, Container } from "@pixi/react";
import { TextStyle } from "pixi.js";
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
        <Text
          text=":)"
          style={style}
          anchor={0.5}
          x={width / 2}
          y={height / 2}
        />
      </Viewport>
    </Stage>
  );
}

export default App;
