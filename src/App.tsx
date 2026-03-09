import { useRef, useEffect, useState } from "react";

function App() {
  const headerStyle = {
    position: "absolute",
    top: "0",
  };

  return (
    <header style={headerStyle}>
      <img src="./src/assets/ComponentBankSymbol.svg"/>
    </header>
  );
}

export default App;
