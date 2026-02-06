import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts";

const LendButton = () => {
  const { signer, walletAddress, connectWallet } = useWallet();

  const lendETH = async () => {
    if (!signer) {
      await connectWallet();
      return;
    }

    console.log("First");

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      console.log("Second");

      const receiver = "0x5AC2184D783dB06B9DEdF80Ce9b5B1AeB02392C3";
      if (!ethers.isAddress(receiver)) {
        console.log("reaching")
  alert("❌ Invalid Ethereum address");
  return;
}


const tx = await contract.lend(
  receiver,
  { value: ethers.parseEther("0.001") }
);


      console.log("Transaction sent:", tx.hash);

      await tx.wait();
      alert("✅ Loan sent successfully!");
    } catch (err) {
      console.error("Full error:", err);

      // 🟢 User rejected the transaction
      if (err.code === 4001) {
        alert("❌ Transaction rejected by user.");
        return;
      }

      // 🟢 Smart contract revert with reason
      if (err.reason) {
        alert(`❌ Transaction reverted: ${err.reason}`);
        return;
      }

      // 🟢 Ethers v6 revert data
      if (err.info?.error?.message) {
        alert(`❌ ${err.info.error.message}`);
        return;
      }

      // 🟢 Network / RPC issue
      if (err.code === "CALL_EXCEPTION") {
        alert("❌ Contract rejected the transaction. Check input values.");
        return;
      }

      // 🔴 Fallback
      alert("❌ Transaction failed. Please check console.");
    }
  };

  return (
    <>
      <p>Wallet: {walletAddress || "Not connected"}</p>
      <button onClick={lendETH}>
        {walletAddress ? "Lend ETH" : "Connect Wallet"}
      </button>
    </>
  );
};

export default LendButton;
