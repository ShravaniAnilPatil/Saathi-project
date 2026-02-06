import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWalletTransactions } from "../services/etherscan";

import {
  User,
  LogOut,
  History,
  Users,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for the wallet graph
const data = [
  { name: "Mon", balance: 4000 },
  { name: "Tue", balance: 3000 },
  { name: "Wed", balance: 5000 },
  { name: "Thu", balance: 4500 },
  { name: "Fri", balance: 6000 },
  { name: "Sat", balance: 5500 },
  { name: "Sun", balance: 7200 },
];

const Dashboard = ({ walletAddress }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTx = async () => {
      setLoadingTx(true);
      const txs = await getWalletTransactions(walletAddress);
      setTransactions(txs);
      setLoadingTx(false);
    };

    fetchTx();
  }, [walletAddress]);

  // 🔒 Redirect if wallet not connected
  useEffect(() => {
    if (!walletAddress) {
      navigate("/");
    }
  }, [walletAddress, navigate]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#020617] border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded flex items-center justify-center rotate-3">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <span className="text-xl font-bold tracking-tighter text-slate-100">
            SAATHI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white">
            <Users size={18} /> GroupPool
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white">
            <History size={18} /> History
          </button>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-2 text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <Wallet size={16} />
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Not Connected"}
          </div>

          <button className="flex items-center gap-2 text-slate-400 hover:text-white">
            <User size={18} /> Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* TRANSACTIONS */}
        <section className="mt-10">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <History size={18} /> Wallet Transactions
            </h3>

            {loadingTx ? (
              <p className="text-slate-500 text-sm">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-slate-500 text-sm">No transactions found</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {transactions.slice(0, 10).map((tx) => {
                  const isCredit =
                    tx.to?.toLowerCase() === walletAddress.toLowerCase();
                  const amount = (Number(tx.value) / 1e18).toFixed(4);

                  return (
                    <div
                      key={tx.hash}
                      className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-xs text-slate-400">
                          Hash: {tx.hash.slice(0, 10)}...
                        </p>
                        <p className="text-xs text-slate-500">
                          {isCredit ? "From" : "To"}:{" "}
                          {(isCredit ? tx.from : tx.to).slice(0, 6)}...
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isCredit ? (
                          <ArrowDownCircle
                            size={22}
                            className="text-emerald-400"
                          />
                        ) : (
                          <ArrowUpCircle
                            size={22}
                            className="text-red-400"
                          />
                        )}

                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${
                              isCredit
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {isCredit ? "+" : "-"} {amount} ETH
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {isCredit ? "Received" : "Sent"} • Block #
                            {tx.blockNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* GRAPH */}
        <section className="mb-10">
          <div className="bg-slate-900/20 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-slate-500" /> Wallet Performance
            </h3>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#94a3b8"
                    fill="#334155"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 py-8 text-center border-t border-slate-900">
        <p className="text-slate-600 text-xs">Developed by Team 4grams</p>
      </footer>
    </div>
  );
};

export default Dashboard;
