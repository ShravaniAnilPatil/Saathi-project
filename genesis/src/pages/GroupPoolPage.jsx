import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Users, Wallet } from "lucide-react";
import { getGroupPoolContract } from "../utils/blockchain";

const GroupPoolPage = ({ walletAddress }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = async () => {
    try {
      setIsCreating(true);
      setStatus("Creating group...");

      const contract = getGroupPoolContract();
      // Admin is deployer, so you can optionally call something like addMember for self
      // Here, just showing a dummy tx
      // If your contract logic requires initial funding:
      const tx = await contract.deployTransaction; // Already deployed
      setStatus("Group pool created! You are admin.");
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      setStatus("Error creating group.");
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#020617] border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded flex items-center justify-center rotate-3">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-slate-100">
            SAATHI
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <Wallet size={16} />
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Not Connected"}
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <section className="mt-10 bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-800 rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Group Pool Dashboard</h2>

          <p className="text-slate-400 mb-4">
            Here you can create and manage your group pool.
          </p>

          <button
            onClick={handleCreateGroup}
            disabled={isCreating}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
          >
            {isCreating ? "Creating..." : "Create Group"}
          </button>

          {status && (
            <p className="mt-4 text-slate-300 font-medium">{status}</p>
          )}
        </section>

        {/* Future features: Join group, View members, Pool balance */}
      </main>

      <footer className="mt-20 py-8 text-center border-t border-slate-900">
        <p className="text-slate-600 text-xs">Developed by Team 4grams</p>
      </footer>
    </div>
  );
};

export default GroupPoolPage;
