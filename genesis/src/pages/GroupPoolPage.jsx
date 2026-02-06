import React, { useState } from "react";
import { ethers } from "ethers";
import { Users, Sparkles } from "lucide-react";
import { getFactoryContract } from "../utils/contract";

const GroupPoolPage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      setStatus("Creating Group Pool...");

      const factory = await getFactoryContract();
      const tx = await factory.createGroupPool();

      await tx.wait();

      setStatus("✅ Group Pool Created Successfully!");
      alert("Group Pool Created Successfully!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error creating group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center px-6">
      
      {/* Main Card */}
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900/70 to-slate-950/70 border border-slate-800 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg">
            <Users size={24} className="text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Create Group Pool
            </h2>
            <p className="text-slate-400 text-sm">
              Start a new community lending pool
            </p>
          </div>
        </div>

        {/* Feature Info */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles size={18} className="text-cyan-400" />
            <span className="text-sm">
              Instantly deploy a decentralized savings group
            </span>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreateGroup}
          disabled={loading}
          className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl 
                     hover:bg-slate-200 transition-all duration-300
                     shadow-lg hover:shadow-xl active:scale-95"
        >
          {loading ? "Creating Pool..." : "Create Pool"}
        </button>

        {/* Status Message */}
        {status && (
          <p className="mt-6 text-center text-sm text-slate-300 font-medium">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupPoolPage;
