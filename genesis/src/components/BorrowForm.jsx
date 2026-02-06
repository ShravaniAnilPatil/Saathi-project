import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";


const CONTRACT_ADDRESS = "0x736C06E0d2f09fC1cf34DDaAA037D18b049170f3";

export default function BorrowForm() {

  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");

  // ⭐ Load wallet from localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");

    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  const handleBorrow = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      LoanManagerJSON.abi,
      signer
    );

    // ⚠ Convert amount to wei
    const amountInWei = ethers.parseEther(amount);

    const tx = await contract.createLoan(amountInWei, duration);

    await tx.wait();

    alert("Loan created successfully 🚀");

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div>
      <h2>Borrow Loan</h2>

      <p>Wallet: {walletAddress}</p>

      <input
        type="number"
        placeholder="Loan Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duration (days)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <button onClick={handleBorrow}>Request Loan</button>
    </div>
  );
}
