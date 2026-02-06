const { ethers } = require("hardhat");

async function main() {
  const LOAN_MANAGER_ADDRESS = process.env.LOAN_MANAGER_ADDRESS || "0x";

  if (LOAN_MANAGER_ADDRESS === "0x") {
    throw new Error("Please set LOAN_MANAGER_ADDRESS in .env");
  }

  const [borrower] = await ethers.getSigners();
  console.log("Borrower withdrawing funds:", borrower.address);

  const loanManager = await ethers.getContractAt(
    "LoanManager",
    LOAN_MANAGER_ADDRESS,
    borrower
  );

  try {
    // Get all loans
    const loans = await loanManager.getLoans();
    console.log(`Total loans: ${loans.length}`);

    if (loans.length === 0) {
      throw new Error("No loans found");
    }

    // Find a funded but not yet withdrawn loan for this borrower
    let loanToWithdraw = null;
    let loanId = null;

    for (let i = 0; i < loans.length; i++) {
      if (
        loans[i].borrower.toLowerCase() === borrower.address.toLowerCase() &&
        loans[i].funded &&
        !loans[i].withdrawn
      ) {
        loanToWithdraw = loans[i];
        loanId = i;
        break;
      }
    }

    if (loanToWithdraw === null) {
      throw new Error("No funded loans available to withdraw");
    }

    console.log(`\n📋 Withdrawing Loan ID ${loanId}:`);
    console.log(`  Amount: ${ethers.formatEther(loanToWithdraw.amount)} ETH`);
    console.log(`  Lender: ${loanToWithdraw.lender}`);

    // Withdraw the loan
    console.log("\nWithdrawing funds...");
    const tx = await loanManager.withdrawLoan(loanId);
    const receipt = await tx.wait();

    console.log("✅ Loan withdrawn successfully!");
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
