import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white">
            <Users size={18} /> GroupPool
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white">
            <History size={18} /> History
          </button>

          <div className="h-6 w-px bg-slate-800" />

          {/* Wallet Display */}
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
        {/* Wallet Overview */}
        <section className="mb-10">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-500 text-sm font-medium mb-1">
                Total Wallet Balance
              </p>
              <h2 className="text-4xl font-bold text-white mb-8">
                $12,450.80{" "}
                <span className="text-emerald-500 text-sm font-normal ml-2">
                  +2.4% today
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="flex items-center justify-center gap-3 p-5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                  <ArrowDownCircle size={24} /> Take a Loan
                </button>
                <button className="flex items-center justify-center gap-3 p-5 bg-slate-800 border border-slate-700 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all">
                  <ArrowUpCircle size={24} /> Lend Money
                </button>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>
        </section>

        {/* Analytics Graph */}
        <section className="mb-10">
          <div className="bg-slate-900/20 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-slate-500" /> Wallet Performance
            </h3>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#475569" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#94a3b8"
                    fill="url(#colorBalance)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Active Transactions */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Loans */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock size={18} className="text-orange-400" /> Loans to Repay
            </h3>

            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-4"
              >
                <div>
                  <p className="text-sm font-medium">
                    Personal Loan #024{item}
                  </p>
                  <p className="text-xs text-slate-500">
                    Due in {item * 5} days
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">$500.00</p>
                  <button className="text-[10px] font-bold text-blue-400">
                    Repay Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Lendings */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" /> Active Lendings
            </h3>

            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-4"
              >
                <div>
                  <p className="text-sm font-medium">
                    Borrower: 0x71...{item}e4
                  </p>
                  <p className="text-xs text-slate-500">
                    Interest: 12% APY
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">
                    +$1,200.00
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                    On Track
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 text-center border-t border-slate-900">
        <p className="text-slate-600 text-xs">Developed by Team 4grams</p>
      </footer>
    </div>
  );
};

export default Dashboard;
