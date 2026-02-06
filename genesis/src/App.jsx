import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GroupPoolPage from "./pages/GroupPoolPage";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
// import TestBorrowPage from "./pages/TestBorrowPage";
import CreateLoanButton from "./pages/CreateLoanBUtton";
import TestBorrowPage from "./pages/BorrowForm";
import GlobalLoanRequests from "./pages/BorrowRequest";
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
        <Route path="/grouppool" element={<GroupPoolPage walletAddress={walletAddress} />} />
        <Route
          path="/dashboard"
          element={<Home walletAddress={walletAddress} />}
        />

        <Route
          path="/create-loan"
          element={<CreateLoanButton walletAddress={walletAddress} />}
        />

        <Route
          path="/borrowform"
          element={<TestBorrowPage walletAddress={walletAddress} />}
        />

        <Route
          path="/lend"
          element={<GlobalLoanRequests walletAddress={walletAddress} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
