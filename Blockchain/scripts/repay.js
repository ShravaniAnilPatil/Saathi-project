const { ethers } = require("hardhat");

async function main() {
  // Update with your deployed LoanManager address
  const LOAN_MANAGER_ADDRESS = process.env.LOAN_MANAGER_ADDRESS || "0x";

  if (LOAN_MANAGER_ADDRESS === "0x") {
    throw new Error("Please set LOAN_MANAGER_ADDRESS in .env or script");
  }

  const [borrower] = await ethers.getSigners();
  console.log("Borrower repaying from:", borrower.address);

  const loanManager = await ethers.getContractAt(
    "LoanManager",
    LOAN_MANAGER_ADDRESS,
    borrower
  );

  try {
    // Get all loans first
    const allLoans = await loanManager.getLoans();
    console.log("Total loans in contract:", allLoans.length);

    if (allLoans.length === 0) {
      throw new Error("No loans found in the contract");
    }

    // Find loans for this borrower
    let borrowerLoanId = null;
    for (let i = 0; i < allLoans.length; i++) {
      if (allLoans[i].borrower.toLowerCase() === borrower.address.toLowerCase()) {
        console.log("Found loan ID:", i);
        borrowerLoanId = i;
        break;
      }
    }

    if (borrowerLoanId === null) {
      throw new Error("No active loan found for this borrower");
    }
    const loanId = borrowerLoanId;
    console.log("Repaying loan ID:", loanId);

    // Get loan details
    const loan = await loanManager.loans(loanId);
    console.log("Loan details:");
    console.log("  - Principal Amount:", ethers.formatEther(loan.amount), "ETH");
    console.log("  - Interest Rate:", (Number(loan.interestRate) / 100).toFixed(2), "%");
    console.log("  - Funded:", loan.funded);
    console.log("  - Withdrawn:", loan.withdrawn);
    console.log("  - Repaid:", loan.repaid);

    if (loan.repaid) {
      throw new Error("This loan is already repaid");
    }

    if (!loan.withdrawn) {
      throw new Error("This loan has not been withdrawn yet");
    }

    // Calculate total repayment amount (principal + interest)
    const totalRepayment = await loanManager.calculateRepayment(loanId);
    const interest = totalRepayment - loan.amount;
    
    console.log("\nRepayment Breakdown:");
    console.log("  - Principal:", ethers.formatEther(loan.amount), "ETH");
    console.log("  - Interest:", ethers.formatEther(interest), "ETH");
    console.log("  - Total to Repay:", ethers.formatEther(totalRepayment), "ETH");

    // Repay the loan
    console.log("\nRepaying loan...");
    const tx = await loanManager.repayLoan(loanId, {
      value: totalRepayment,
    });

    const receipt = await tx.wait();
    console.log("✅ Loan repaid successfully!");
    console.log("Transaction hash:", receipt.hash);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
