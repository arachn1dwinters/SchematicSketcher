import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Switch from "./assets/ComponentBankSymbol.svg?react";
import { ComponentBank } from "./ComponentBank";

function App() {
  const [bankOpen, setBankOpen] = useState(false);

  const headerStyle = {
    top: "0",
    height: "50px",
    backgroundColor: "#ffffea",
    display: "flex",
    justifyContent: "right",
    cursor: "default",
  };

  const imageBankSymbolStyle = {
    width: "75px",
    height: "auto",
    cursor: "pointer",
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

  const openBank = () => {
    setBankOpen(!bankOpen);
  }

  return (
    <div>
      <div style={headerStyle}>
        <div ref={container}>
          <Switch
            onClick={openBank} 
            style={imageBankSymbolStyle}/>
        </div>
      </div>
      { bankOpen &&
        <ComponentBank />
      }
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);