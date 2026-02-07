import { useEffect, useState } from "react";
import { ethers } from "ethers";
import LoanManagerJSON from "../abi/LoanManager.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOAN_MANAGER_ADDRESS;

export default function MyLoans({ walletAddress }) {
  const [myBorrowedLoans, setMyBorrowedLoans] = useState([]);
  const [myLentLoans, setMyLentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    section: {
      marginTop: "24px",
      padding: "24px",
      backgroundColor: "#0f172a",
      borderRadius: "16px",
      border: "1px solid #1e293b"
    },
    header: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "16px",
      color: "#60a5fa"
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 8px",
      textAlign: "left"
    },
    th: {
      padding: "12px 16px",
      color: "#94a3b8",
      fontSize: "12px",
      textTransform: "uppercase",
      fontWeight: "700",
      borderBottom: "1px solid #1e293b"
    },
    tr: {
      backgroundColor: "#1e293b",
    },
    td: {
      padding: "14px 16px",
      fontSize: "14px",
      color: "#e2e8f0",
      borderTop: "1px solid #334155",
      borderBottom: "1px solid #334155"
    },
    btn: (bg) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "13px",
      backgroundColor: bg,
      color: "white",
      marginRight: "8px"
    }),
    badge: (status) => ({
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: status === 'Active' ? "#064e3b" : status === 'Funded' ? "#1e40af" : status === 'Repaid' ? "#166534" : "#1e293b",
      color: status === 'Active' ? "#34d399" : status === 'Funded' ? "#60a5fa" : status === 'Repaid' ? "#4ade80" : "#94a3b8"
    }),
    emptyState: {
      textAlign: "center",
      padding: "20px",
      color: "#64748b",
      fontSize: "14px"
    }
  };

  useEffect(() => {
    if (walletAddress) {
      loadMyLoans();
    }
  }, [walletAddress]);

  const loadMyLoans = async () => {
    try {
      if (!window.ethereum || !walletAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        provider
      );

      const rawLoans = await loanManager.getLoans();

      const allLoans = rawLoans.map((loan, index) => {
        const createdAtTimestamp = Number(loan.createdAt) * 1000;
        const durationMs = Number(loan.duration) * 1000;
        const dueDate = new Date(createdAtTimestamp + durationMs);
        const isOverdue = Date.now() > dueDate.getTime() && !loan.repaid;
        
        return {
          loanId: index,
          borrower: loan.borrower,
          lender: loan.lender,
          amountWei: loan.amount,
          amountEth: ethers.formatEther(loan.amount),
          interestRate: (Number(loan.interestRate) / 100).toFixed(2),
          safetyFee: (Number(loan.safetyFee) / 100).toFixed(2),
          duration: Number(loan.duration),
          createdAt: new Date(createdAtTimestamp).toLocaleString(),
          dueDate: dueDate.toLocaleDateString(),
          isOverdue: isOverdue,
          funded: loan.funded,
          repaid: loan.repaid,
          withdrawn: loan.withdrawn,
          defaulted: loan.defaulted,
        };
      });

      // Filter loans where user is borrower
      const borrowed = allLoans.filter(
        (loan) => loan.borrower.toLowerCase() === walletAddress.toLowerCase() && loan.funded
      );

      // Filter loans where user is lender
      const lent = allLoans.filter(
        (loan) => loan.lender.toLowerCase() === walletAddress.toLowerCase()
      );

      setMyBorrowedLoans(borrowed);
      setMyLentLoans(lent);
    } catch (err) {
      console.error("Error loading loans:", err);
    } finally {
      setLoading(false);
    }
  };

  const withdrawLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const tx = await loanManager.withdrawLoan(loan.loanId);
      await tx.wait();

      alert("✅ Funds withdrawn successfully!");
      loadMyLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  const repayLoan = async (loan) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const loanManager = new ethers.Contract(
        CONTRACT_ADDRESS,
        LoanManagerJSON.abi,
        signer
      );

      const repaymentAmount = await loanManager.calculateRepayment(loan.loanId);
      const tx = await loanManager.repayLoan(loan.loanId, { value: repaymentAmount });
      await tx.wait();

      alert("✅ Loan repaid successfully! Your trust score has increased.");
      loadMyLoans();
    } catch (err) {
      console.error(err);
      alert(err.reason || "Transaction failed");
    }
  };

  const getLoanStatus = (loan) => {
    if (loan.repaid) return "Repaid";
    if (loan.defaulted) return "Defaulted";
    if (loan.withdrawn) return "Active";
    if (loan.funded) return "Funded";
    return "Requested";
  };

  if (loading) {
    return <div style={styles.emptyState}>Loading your loans...</div>;
  }

  return (
    <div>
      {/* MY BORROWED LOANS */}
      <div style={styles.section}>
        <h3 style={styles.header}>📥 My Borrowed Loans</h3>
        {myBorrowedLoans.length === 0 ? (
          <p style={styles.emptyState}>You have no active borrowed loans.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Interest</th>
                <th style={styles.th}>Safety Fee</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {myBorrowedLoans.map((loan) => (
                <tr key={loan.loanId} style={styles.tr}>
                  <td style={styles.td}>#{loan.loanId}</td>
                  <td style={styles.td}>{loan.amountEth} ETH</td>
                  <td style={styles.td}>{loan.interestRate}%</td>
                  <td style={styles.td}>{loan.safetyFee}%</td>
                  <td style={{
                    ...styles.td,
                    color: loan.isOverdue ? '#f87171' : '#e2e8f0',
                    fontWeight: loan.isOverdue ? '700' : '400'
                  }}>
                    {loan.dueDate}
                    {loan.isOverdue && !loan.repaid && <span style={{ marginLeft: '6px', color: '#f87171' }}>⚠️</span>}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(getLoanStatus(loan))}>
                      {getLoanStatus(loan)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {loan.funded && !loan.withdrawn && !loan.repaid && (
                      <button onClick={() => withdrawLoan(loan)} style={styles.btn("#10b981")}>
                        Withdraw
                      </button>
                    )}
                    {loan.withdrawn && !loan.repaid && (
                      <button onClick={() => repayLoan(loan)} style={styles.btn("#3b82f6")}>
                        Repay
                      </button>
                    )}
                    {loan.repaid && <span style={{ color: '#10b981' }}>✓ Settled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MY LENT LOANS */}
      <div style={styles.section}>
        <h3 style={{ ...styles.header, color: "#f59e0b" }}>📤 My Lent Loans</h3>
        {myLentLoans.length === 0 ? (
          <p style={styles.emptyState}>You have not funded any loans yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Borrower</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Interest</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Returns</th>
              </tr>
            </thead>
            <tbody>
              {myLentLoans.map((loan) => {
                const interest = (parseFloat(loan.amountEth) * parseFloat(loan.interestRate) / 100).toFixed(4);
                const total = (parseFloat(loan.amountEth) + parseFloat(interest)).toFixed(4);
                
                return (
                  <tr key={loan.loanId} style={styles.tr}>
                    <td style={styles.td}>#{loan.loanId}</td>
                    <td style={styles.td}>
                      <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
                        {loan.borrower.slice(0, 6)}...{loan.borrower.slice(-4)}
                      </span>
                    </td>
                    <td style={styles.td}>{loan.amountEth} ETH</td>
                    <td style={styles.td}>{loan.interestRate}%</td>
                    <td style={{
                      ...styles.td,
                      color: loan.isOverdue ? '#f87171' : '#e2e8f0',
                      fontWeight: loan.isOverdue ? '700' : '400'
                    }}>
                      {loan.dueDate}
                      {loan.isOverdue && !loan.repaid && <span style={{ marginLeft: '6px', color: '#f87171' }}>⚠️</span>}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(getLoanStatus(loan))}>
                        {getLoanStatus(loan)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {loan.repaid ? (
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          +{interest} ETH ✓
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>
                          Expected: +{interest} ETH
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
