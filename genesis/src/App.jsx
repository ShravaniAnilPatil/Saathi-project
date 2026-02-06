import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";

function App() {
  // ✅ COMMON STATE (THIS WAS MISSING)
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />
          }
        />

        <Route
          path="/dashboard"
          element={<Home walletAddress={walletAddress} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
