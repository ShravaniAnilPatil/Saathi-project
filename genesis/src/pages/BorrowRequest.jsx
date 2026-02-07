import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;

export default function OpenLoanRequests() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLendingModal, setShowLendingModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        provider
      );

      const rawLoans = await loanManager.getLoans();

      const formattedLoans = rawLoans
        .filter((loan) => loan.borrower !== ethers.ZeroAddress)
        .map((loan, index) => ({
          loanId: index,
          borrower: loan.borrower,
          lender: loan.lender,
          amountWei: loan.amount,
          amountEth: ethers.formatEther(loan.amount),
          interestRate: (Number(loan.interestRate) / 100).toFixed(2),
          duration: Number(loan.duration),
          createdAt: new Date(Number(loan.createdAt) * 1000).toLocaleString(),
          funded: loan.funded,
          repaid: loan.repaid,
          withdrawn: loan.withdrawn,
          defaulted: loan.defaulted,
        }));

      setLoans(formattedLoans);
      console.log("Formatted loans:", formattedLoans);
    } catch (err) {
      console.error("Error loading loans:", err);
    } finally {
      setLoading(false);
    }
  };

  const openLendingModal = (loan) => {
    setSelectedLoan(loan);
    setShowLendingModal(true);
  };

  const closeLendingModal = () => {
    setShowLendingModal(false);
    setSelectedLoan(null);
  };

  const lendIndividually = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const tx = await loanManager.fundLoan(loan.loanId, {
        value: loan.amountWei,
      });

      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      alert("✅ Loan funded individually!");
      closeLendingModal();
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  const lendViaSafetyPool = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      // ⚠️ THIS FUNCTION NEEDS TO BE ADDED TO YOUR SMART CONTRACT
      const tx = await loanManager.fundLoanFromPool(loan.loanId, {
        value: loan.amountWei,
      });

      console.log("Safety Pool Transaction sent:", tx.hash);
      await tx.wait();

      alert("✅ Loan funded via Safety Pool!");
      closeLendingModal();
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(
        err.reason ||
          "Transaction failed. Make sure the smart contract has fundLoanFromPool() function."
      );
    }
  };

  const withdrawLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      if (userAddress.toLowerCase() !== loan.borrower.toLowerCase()) {
        alert("❌ Only the borrower can withdraw this loan.");
        return;
      }

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const tx = await loanManager.withdrawLoan(loan.loanId);
      console.log("Withdraw transaction sent:", tx.hash);
      await tx.wait();

      alert("✅ Funds withdrawn successfully!");
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  const repayLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      if (userAddress.toLowerCase() !== loan.borrower.toLowerCase()) {
        alert("❌ Only the borrower can repay this loan.");
        return;
      }

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const repaymentAmount = await loanManager.calculateRepayment(
        loan.loanId
      );
      const tx = await loanManager.repayLoan(loan.loanId, {
        value: repaymentAmount,
      });
      console.log("Repay transaction sent:", tx.hash);
      await tx.wait();

      alert("✅ Loan repaid successfully!");
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  const getLoanStatus = (loan) => {
    if (loan.repaid) return "Repaid";
    if (loan.withdrawn) return "Active";
    if (loan.funded) return "Funded (Withdraw)";
    return "Requested";
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mt-10 p-6 bg-slate-950 rounded-2xl text-slate-200 font-sans shadow-2xl border border-slate-800 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-5 text-blue-400 tracking-tight">
          Open Loan Requests (Global)
        </h2>

        {loading ? (
          <div className="text-center py-10 text-slate-500">
            <div className="spinner">Loading loans...</div>
          </div>
        ) : loans.length === 0 ? (
          <p className="text-center py-10 text-slate-500">
            No loan requests found in the smart contract.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                    Loan ID
                  </th>
                  <th className="px-4 py-3 text-left text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                    Borrower
                  </th>
                  <th className="px-4 py-3 text-left text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                    Interest
                  </th>
                  <th className="px-4 py-3 text-left text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr
                    key={loan.loanId}
                    className="bg-slate-900 transition-transform hover:scale-[1.01]"
                  >
                    <td className="px-4 py-4 text-sm border-t border-b border-l border-slate-800 rounded-l-lg">
                      #{loan.loanId}
                    </td>
                    <td className="px-4 py-4 text-sm border-t border-b border-slate-800">
                      <span className="font-mono bg-slate-800 px-2 py-1 rounded-md text-sky-400">
                        {loan.borrower.slice(0, 6)}...
                        {loan.borrower.slice(-4)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-white border-t border-b border-slate-800">
                      {loan.amountEth}{" "}
                      <span className="text-blue-400 text-xs">ETH</span>
                    </td>
                    <td className="px-4 py-4 text-sm border-t border-b border-slate-800">
                      {loan.interestRate}%
                    </td>
                    <td className="px-4 py-4 text-sm border-t border-b border-slate-800">
                      {Math.floor(loan.duration / 86400)} Days
                    </td>
                    <td className="px-4 py-4 text-sm border-t border-b border-slate-800">
                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${
                          getLoanStatus(loan) === "Active"
                            ? "bg-emerald-900 text-emerald-400 border-emerald-600"
                            : "bg-slate-800 text-slate-400 border-slate-600"
                        }`}
                      >
                        {getLoanStatus(loan)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-right border-t border-b border-r border-slate-800 rounded-r-lg">
                      {!loan.funded && (
                        <button
                          onClick={() => openLendingModal(loan)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:opacity-80 transition-opacity shadow-lg"
                        >
                          Lend Funds
                        </button>
                      )}

                      {loan.funded && !loan.withdrawn && !loan.repaid && (
                        <button
                          onClick={() => withdrawLoan(loan)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs hover:opacity-80 transition-opacity shadow-lg"
                        >
                          Withdraw
                        </button>
                      )}

                      {loan.withdrawn && !loan.repaid && (
                        <button
                          onClick={() => repayLoan(loan)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-xs hover:opacity-80 transition-opacity shadow-lg"
                        >
                          Repay Loan
                        </button>
                      )}

                      {loan.repaid && (
                        <span className="text-emerald-500 font-semibold">
                          <i className="mr-1">✓</i> Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 🔥 LENDING MODE MODAL */}
        {showLendingModal && selectedLoan && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeLendingModal}
          >
            <div
              className="bg-slate-900 rounded-2xl p-8 w-11/12 max-w-lg border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                Choose Lending Mode
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Select how you want to fund this loan
              </p>

              {/* Loan Details */}
              <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-400">Loan Amount:</span>
                  <span className="text-slate-200 font-semibold">
                    {selectedLoan.amountEth} ETH
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-slate-400">Interest Rate:</span>
                  <span className="text-slate-200 font-semibold">
                    {selectedLoan.interestRate}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-slate-200 font-semibold">
                    {Math.floor(selectedLoan.duration / 86400)} Days
                  </span>
                </div>
              </div>

              {/* Option 1: Individual Lending */}
              <button
                onClick={() => lendIndividually(selectedLoan)}
                className="w-full p-4 mb-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-left hover:border-blue-400 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-2 text-base text-blue-400 font-semibold mb-1">
                  <span>👤</span> Lend Individually
                </div>
                <div className="text-sm text-slate-400 font-normal">
                  Fund the loan directly. You receive 100% of the interest when
                  repaid.
                </div>
              </button>

              {/* Option 2: Safety Pool Lending */}
              <button
                onClick={() => lendViaSafetyPool(selectedLoan)}
                className="w-full p-4 mb-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-left hover:border-emerald-500 hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center gap-2 text-base text-blue-400 font-semibold mb-1">
                  <span>🛡️</span> Lend via Safety Pool
                </div>
                <div className="text-sm text-slate-400 font-normal">
                  Community-backed lending. You get 90% profit + default
                  protection from pool members.
                </div>
              </button>

              {/* Cancel Button */}
              <button
                onClick={closeLendingModal}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 font-semibold text-sm hover:bg-slate-950 transition-colors mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}