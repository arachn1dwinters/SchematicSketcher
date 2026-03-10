import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Switch from "./assets/ComponentBankSymbol.svg?react";

function App() {
  const headerStyle = {
    position: "sticky",
    top: "0",
    backgroundColor: "#ffffea",
    display: "flex",
    justifyContent: "right",
    cursor: "default",
  };

  const imageBankSymbolStyle = {
    width: "75px",
    height: "auto",
  };

  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      const arm = container.current.querySelector("#SwitchArm");

      container.current.addEventListener("mouseenter", () => {
        gsap.to(arm, { rotation: -25, transformOrigin: "0% 50%", duration: 0.4 });
      });

      container.current.addEventListener("mouseleave", () => {
        gsap.to(arm, { rotation: 0, duration: 0.4 });
      });
    }
  });

  return (
    <header style={headerStyle}>
      <div ref={container}>
        <Switch style={imageBankSymbolStyle}/>
      </div>
    </header>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);