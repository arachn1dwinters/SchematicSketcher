import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useRef, useEffect, useState } from "react";

function App() {
  const headerStyle = {
    position: "sticky",
    top: "0",
    backgroundColor: "#ffffea",
  };

  const imageBankSymbolStyle = {
    right: "0",
  };

  return (
    <header style={headerStyle}>
      <img style={imageBankSymbolStyle}
        id="imageBankSymbol" 
        src="./src/assets/ComponentBankSymbol.svg">
      </img>
    </header>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);