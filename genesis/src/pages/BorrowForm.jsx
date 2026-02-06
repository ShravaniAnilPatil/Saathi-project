import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const LOAN_MANAGER_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;
const TRUST_SCORE_ADDRESS = import.meta.env.VITE_TRUST_SCORE_ADDRESS;

export default function TestBorrowPage() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [trustScore, setTrustScore] = useState(null);
  const [interestRate, setInterestRate] = useState(null);

  // 🔹 Check wallet on load
  useEffect(() => {
    const checkWallet = async () => {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await fetchTrustScore(accounts[0]);
      }
    };

    checkWallet();
  }, []);

  // 🔹 Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setWalletAddress(accounts[0]);
    await fetchTrustScore(accounts[0]);
  };

  // 🔹 Fetch Trust Score
  const fetchTrustScore = async (address) => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const trustScoreContract = new ethers.Contract(
      TRUST_SCORE_ADDRESS,
      ["function getScore(address) view returns (uint256)"],
      provider
    );

    const score = await trustScoreContract.getScore(address);
    const numericScore = Number(score);

    setTrustScore(numericScore);
    calculateInterestRate(numericScore);
    console.log(trustScore)
  };

  // 🔹 Interest Rate Logic (example)
  const calculateInterestRate = (score) => {
    if (score >= 90) setInterestRate("3%");
    else if (score >= 75) setInterestRate("5%");
    else if (score >= 60) setInterestRate("8%");
    else if (score >= 50) setInterestRate("12%");
    else setInterestRate("15%");
  };

  // 🔹 Request Loan
  const requestLoan = async () => {
    try {
      if (!amount || !duration) {
        alert("Enter amount and duration");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        LOAN_MANAGER_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const amountInWei = ethers.parseEther(amount);
      const durationInSeconds =
        BigInt(duration) * 24n * 60n * 60n;

      const tx = await loanManager.createLoan(
        amountInWei,
        durationInSeconds
      );

      await tx.wait();
      alert("Loan requested successfully 🚀");
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  return (
    <div style={{
  padding: "40px",
  maxWidth: "600px",
  margin: "0 auto",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  border: "1px solid #e2e8f0"
}}>
  <h1 style={{
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: "32px",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  }}>
    💰 Borrow Page
  </h1>

  {!walletAddress ? (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={connectWallet}
        style={{
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "16px 32px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#2563eb";
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#3b82f6";
          e.target.style.transform = "translateY(0px)";
          e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
        }}
      >
        🔗 Connect Wallet
      </button>
    </div>
  ) : (
    <>
      <div style={{
        backgroundColor: "#dcfce7",
        border: "2px solid #16a34a",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "32px",
        textAlign: "center"
      }}>
        <p style={{
          margin: "0",
          fontSize: "16px",
          color: "#15803d"
        }}>
          <b>🔗 Connected Wallet:</b> 
          <span style={{
            fontFamily: "monospace",
            backgroundColor: "#f0fdf4",
            padding: "4px 8px",
            borderRadius: "6px",
            marginLeft: "8px",
            fontSize: "14px"
          }}>
            {walletAddress}
          </span>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px"
            }}>
              📊 Trust Score
            </label>
            <input
              value={trustScore ?? "Loading..."}
              disabled
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "2px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                fontSize: "16px",
                fontWeight: "600",
                color: "#6b7280",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px"
            }}>
              📈 Rate of Interest
            </label>
            <input
              value={interestRate ?? "Loading..."}
              disabled
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "8px",
                border: "2px solid #e5e7eb",
                backgroundColor: interestRate === "Not eligible" ? "#fee2e2" : "#f9fafb",
                fontSize: "16px",
                fontWeight: "600",
                color: interestRate === "Not eligible" ? "#dc2626" : "#6b7280",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        <div>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px"
          }}>
            💎 Loan Amount (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ETH"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #d1d5db",
              fontSize: "16px",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <div>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px"
          }}>
            ⏰ Duration (Days)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter loan duration"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #d1d5db",
              fontSize: "16px",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
        </div>

        <button
          onClick={requestLoan}
          disabled={interestRate === "Not eligible"}
          style={{
            backgroundColor: interestRate === "Not eligible" ? "#9ca3af" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "16px 24px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: interestRate === "Not eligible" ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: interestRate === "Not eligible" ? "none" : "0 4px 12px rgba(16, 185, 129, 0.3)",
            marginTop: "16px"
          }}
          onMouseOver={(e) => {
            if (interestRate !== "Not eligible") {
              e.target.style.backgroundColor = "#059669";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(16, 185, 129, 0.4)";
            }
          }}
          onMouseOut={(e) => {
            if (interestRate !== "Not eligible") {
              e.target.style.backgroundColor = "#10b981";
              e.target.style.transform = "translateY(0px)";
              e.target.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
            }
          }}
        >
          {interestRate === "Not eligible" ? "❌ Not Eligible for Loan" : "🚀 Request Loan"}
        </button>
      </div>
    </>
  )}
</div>

  );
}
