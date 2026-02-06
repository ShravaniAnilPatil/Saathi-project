import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getWalletTransactions } from "../services/etherscan";
import { getWalletBalance } from "../services/etherscan";
import { Link } from "react-router-dom";
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
const [balance, setBalance] = useState(null);

  // useEffect(() => {
  // if (!walletAddress) return;

//   const fetchBalance = async () => {
//     try {
//       const wei = await getWalletBalance(walletAddress);
//       console.log("first")
// const eth = (Number(wei) / 1e18).toFixed(4);
// console.log("second")
// setBalance(eth);

//     } catch (err) {
//       console.error("Balance fetch failed:", err);
//       setBalance("0.0000");
//     }
//   };

//   fetchBalance();
// }, [walletAddress]);


// useEffect(() => {
//   if (!walletAddress) return;

//   const fetchTransactions = async () => {
//     setLoadingTx(true);

//     const txs = await getWalletTransactions(walletAddress);

//     console.log("Transactions received in component:", txs);

//     setTransactions(txs); // ✅ ALL transactions stored here
//     setLoadingTx(false);
//   };

//   fetchTransactions();
// }, [walletAddress]);
useEffect(() => {
  if (!walletAddress) return;

  const fetchWalletData = async () => {
    try {
      setLoadingTx(true);

      const [wei, txs] = await Promise.all([
        getWalletBalance(walletAddress),
        getWalletTransactions(walletAddress),
      ]);

      console.log("Fetched wei:", wei);
      console.log("Fetched txs:", txs); // should be 69 items

      setBalance((Number(wei) / 1e18).toFixed(4));
      setTransactions(txs); // ✅ directly set array
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setBalance("0.0000");
      setTransactions([]);
    } finally {
      setLoadingTx(false);
    }
  };

  fetchWalletData();
}, [walletAddress]);


console.log(transactions)
// useEffect(() => {
//   if (!window.ethereum) return;

//   const handleChainChanged = () => {
//     window.location.reload();
//   };

//   window.ethereum.on("chainChanged", handleChainChanged);

//   return () => {
//     window.ethereum.removeListener("chainChanged", handleChainChanged);
//   };
// }, []);


useEffect(() => {
  if (!window.ethereum) return;

  const handleAccountsChanged = (accounts) => {
    console.log("Accounts changed:", accounts);
    // let parent handle walletAddress
  };

  const handleChainChanged = () => {
    console.log("Chain changed");
    // refetch happens automatically via walletAddress effect
  };

  window.ethereum.on("accountsChanged", handleAccountsChanged);
  window.ethereum.on("chainChanged", handleChainChanged);

  return () => {
    window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    window.ethereum.removeListener("chainChanged", handleChainChanged);
  };
}, []);






  // 🔒 Redirect if wallet not connected
  useEffect(() => {
    if (!walletAddress) {
      <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center">
      <p>Wallet not connected</p>
    </div>
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
          <button
            className="flex items-center gap-2 text-slate-400 hover:text-white"
            onClick={() => navigate("/grouppool")}
          >
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

        <section className="mt-10 bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-800 rounded-3xl p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           {/* ===== WALLET SUMMARY CARD ===== */}
      <div className="bg-slate-900/40 rounded-xl p-6 mb-6">
        <h2 className="text-gray-600 text-sm">Total Wallet Balance</h2>

        <p className="text-3xl font-bold mt-2">
          {balance ? `${balance} ETH` : "Loading..."}
        </p>

        
      </div>

            {/* Action Buttons */}
            <div className="flex gap-4 w-full md:w-auto">
             <Link
  to="/borrowform"
  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
>
  <ArrowDownCircle size={20} /> Borrow
</Link>
              
              <Link to="/lend" className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 transition-all hover:border-slate-600">
                <ArrowUpCircle size={20} /> Lend
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-10">
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
        {transactions.slice(0, 10).map((tx) => (
          <div
            key={tx.hash}
            className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center"
          >
            <div>
              <p className="text-xs text-slate-400">
                Hash: {tx.hash.slice(0, 10)}...
              </p>
              <p className="text-xs text-slate-500">
                From: {tx.from.slice(0, 6)}... → To: {tx.to.slice(0, 6)}...
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-emerald-400">
                {Number(tx.value) / 1e18} ETH
              </p>
              <p className="text-[10px] text-slate-500">
                Block #{tx.blockNumber}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
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
