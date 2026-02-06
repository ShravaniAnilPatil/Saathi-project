import React from 'react';
import { Shield, TrendingUp, Users, Award, Wallet, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { connectWallet } from "../utils/metamask";

const LandingPage = ({ walletAddress, setWalletAddress }) => {
  const navigate = useNavigate();
  const bgImage = "https://static.vecteezy.com/system/resources/thumbnails/001/925/480/small/business-graph-chart-of-stock-market-investment-on-blue-background-vector.jpg";

  const handleConnectWallet = async () => {
  const wallet = await connectWallet();
  if (wallet) {
    setWalletAddress(wallet.address);
    navigate("/dashboard"); 
  }
};


  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-slate-700">
      
      {/* Hero Section with Custom Background */}
      <div 
        className="relative min-h-[90vh] flex flex-col"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.68)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Navigation */}
        <nav className="flex items-center justify-between px-10 py-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-slate-100 group-hover:text-white transition-colors">
              SAATHI<span className="text-slate-500 text-xs ml-1 font-light">Trust</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</button>
            <button className="px-6 py-2 text-sm font-bold border border-slate-700 hover:bg-slate-800 rounded-md transition-all">
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs text-slate-400 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Blockchain Secured Lending
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 tracking-tight max-w-4xl">
            Your Trust is Your <span className="text-slate-400 italic">Collateral</span>
          </h1>
          
          <p className="max-w-xl text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
            A peer-to-peer lending ecosystem where reputation earns you rewards. Borrow against your integrity, not your assets.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button
  onClick={handleConnectWallet}
  className="px-8 py-4 bg-slate-100 text-slate-900 font-bold rounded-lg hover:bg-white transition-all flex items-center gap-2"
>
  {walletAddress ? "Go to Dashboard" : "Get Started"}
  <ArrowUpRight size={18} />
</button>

            <button className="px-8 py-4 bg-transparent border border-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-900/50 transition-all">
              Join a Group Pool
            </button>
          </div>
        </div>
      </div>

      {/* Features - Dark Navy Theme */}
      <section className="py-24 bg-[#020617] px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4">The Trust Ecosystem</h2>
            <div className="h-1 w-20 bg-slate-700 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group border-l border-slate-800 p-6 hover:border-slate-500 transition-colors">
              <Award className="mb-6 text-slate-500 group-hover:text-slate-200 transition-colors" size={32} />
              <h3 className="text-xl font-bold mb-4">Reputation Farming</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Everyone starts with a standard trust score. Repay on time to lower your interest rates and unlock higher liquidity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group border-l border-slate-800 p-6 hover:border-slate-500 transition-colors">
              <TrendingUp className="mb-6 text-slate-500 group-hover:text-slate-200 transition-colors" size={32} />
              <h3 className="text-xl font-bold mb-4">Lender Incentives</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Maximize APY by lending to high-risk newcomers. As they build trust, your risk profile stabilizes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group border-l border-slate-800 p-6 hover:border-slate-500 transition-colors">
              <Users className="mb-6 text-slate-500 group-hover:text-slate-200 transition-colors" size={32} />
              <h3 className="text-xl font-bold mb-4">Safety Pools</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Lend with friends. 10% of group profits fund a collective safety net, covering 50% of any default losses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement / Footer Banner */}
      <section className="py-20 px-8 border-t border-slate-900">
        <div className="max-w-5xl mx-auto bg-slate-900/40 border border-slate-800 p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Build your digital legacy.</h2>
            <p className="text-slate-500">Secure. Decentralized. Human-centric.</p>
          </div>
          <button
  onClick={handleConnectWallet}
  className="whitespace-nowrap px-8 py-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl transition-all flex items-center gap-3"
>
  <Wallet size={20} />
  {walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Connect Wallet"}
</button>

        </div>
      </section>

      {/* Credit Footer */}
      <footer className="py-12 text-center border-t border-slate-900">
        <p className="text-slate-600 text-[10px] tracking-[0.2em] uppercase mb-4">Proprietary Technology of</p>
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-px bg-slate-800"></div>
          <span className="text-slate-400 font-medium tracking-tight">TEAM 4GRAMS</span>
          <div className="w-6 h-px bg-slate-800"></div>
        </div>
        <p className="mt-8 text-slate-700 text-xs">© 2026 Saathi Protocol</p>
      </footer>
    </div>
  );
};

export default LandingPage;