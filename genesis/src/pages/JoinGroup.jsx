import { useState } from "react";
import { ethers } from "ethers";
import { Users, Wallet, ArrowRight } from "lucide-react";
import { connectWallet, getGroupPoolContract } from "../utils/contract";
const JoinGroup = () => {
  const [groupAddress, setGroupAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [contributionAmount, setContributionAmount] = useState("0.01");
  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      setStatus("✅ Wallet connected!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to connect wallet. Install MetaMask.");
    }
  };
  const joinGroup = async () => {
    try {
      if (!groupAddress) {
        setStatus("⚠️ Please enter a group contract address");
        return;
      }
      if (!walletAddress) {
        await handleConnectWallet();
      }
      setLoading(true);
      setStatus("Joining group...");
      const contract = await getGroupPoolContract(groupAddress);
      const tx = await contract.joinGroupAndContribute({
        value: ethers.parseEther(contributionAmount),
      });
      setStatus("⏳ Waiting for confirmation...");
      await tx.wait();
      setStatus("✅ Successfully joined group!");
      alert("Joined Group Successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-lg bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg">
          <Users className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Join Group Pool</h2>
          <p className="text-slate-400 text-sm">
            Enter pool address to become a member
          </p>
        </div>
      </div>
      {/* Wallet Badge */}
      <button
        onClick={handleConnectWallet}
        className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 mb-6 w-full hover:border-cyan-500/50 transition-all cursor-pointer"
      >
        <Wallet size={16} className="text-cyan-400" />
        <span className="text-sm flex-1 text-left">
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Click to Connect Wallet"}
        </span>
        {!walletAddress && <ArrowRight size={14} className="text-slate-500" />}
      </button>
      {/* Group Address Input */}
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">Group Contract Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={groupAddress}
          onChange={(e) => setGroupAddress(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none text-slate-200 placeholder-slate-500"
        />
      </div>
      {/* Contribution Amount Input */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Contribution Amount (ETH)</label>
        <input
          type="number"
          step="0.001"
          min="0.001"
          placeholder="0.01"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 outline-none text-slate-200 placeholder-slate-500"
        />
      </div>
      {/* Join Button */}
      <button
        onClick={joinGroup}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold rounded-xl
                   hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Joining..." : `Join Group (${contributionAmount} ETH)`}
      </button>
      {/* Status */}
      {status && (
        <p className="mt-6 text-center text-sm text-slate-300">{status}</p>
      )}
    </div>
  );
};
export default JoinGroup;