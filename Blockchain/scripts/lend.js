const { ethers } = require("hardhat");

async function main() {
  const LOAN_MANAGER_ADDRESS = process.env.LOAN_MANAGER_ADDRESS || "0x";

  if (LOAN_MANAGER_ADDRESS === "0x") {
    throw new Error("Please set LOAN_MANAGER_ADDRESS in .env");
  }

  const [lender] = await ethers.getSigners();
  console.log("Lender:", lender.address);

  const loanManager = await ethers.getContractAt(
    "LoanManager",
    LOAN_MANAGER_ADDRESS,
    lender
  );

  try {
    // Get all loans to find unfunded ones
    const loans = await loanManager.getLoans();
    console.log(`Total loans: ${loans.length}`);

    if (loans.length === 0) {
      throw new Error("No loans available to fund");
    }

    // Find an unfunded loan
    let loanToFund = null;
    let loanId = null;

    for (let i = 0; i < loans.length; i++) {
      if (!loans[i].funded) {
        loanToFund = loans[i];
        loanId = i;
        break;
      }
    }

    if (loanToFund === null) {
      throw new Error("No unfunded loans found");
    }

    console.log(`\n📋 Funding Loan ID ${loanId}:`);
    console.log(`  Borrower: ${loanToFund.borrower}`);
    console.log(`  Amount: ${ethers.formatEther(loanToFund.amount)} ETH`);
    console.log(`  Duration: ${loanToFund.duration} seconds`);

    // Fund the loan
    console.log("\nFunding loan...");
    const tx = await loanManager.fundLoan(loanId, {
      value: loanToFund.amount,
    });

    const receipt = await tx.wait();
    console.log("✅ Loan funded successfully!");
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
