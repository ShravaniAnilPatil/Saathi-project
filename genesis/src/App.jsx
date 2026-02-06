import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import TestBorrowPage from "./pages/TestBorrowPage";
import CreateLoanButton from "./pages/CreateLoanBUtton";
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
         <Route path="/test-borrow" element={<TestBorrowPage />} />

        <Route
          path="/dashboard"
          element={<Home walletAddress={walletAddress} />}
        />

        <Route
          path="/create-loan"
          element={<CreateLoanButton walletAddress={walletAddress} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
