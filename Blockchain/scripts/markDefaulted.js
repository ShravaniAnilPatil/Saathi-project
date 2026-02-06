const { ethers } = require("hardhat");

async function main() {
  const LOAN_MANAGER_ADDRESS = process.env.LOAN_MANAGER_ADDRESS || "0x";

  if (LOAN_MANAGER_ADDRESS === "0x") {
    throw new Error("Please set LOAN_MANAGER_ADDRESS in .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Caller:", signer.address);

  const loanManager = await ethers.getContractAt(
    "LoanManager",
    LOAN_MANAGER_ADDRESS,
    signer
  );

  try {
    // Get all loans
    const loans = await loanManager.getLoans();
    console.log(`Total loans: ${loans.length}\n`);

    // Find overdue loans
    let overdueLoans = [];
    for (let i = 0; i < loans.length; i++) {
      const isOverdue = await loanManager.isLoanOverdue(i);
      if (isOverdue && !loans[i].repaid && !loans[i].defaulted && loans[i].withdrawn) {
        overdueLoans.push(i);
      }
    }

    if (overdueLoans.length === 0) {
      console.log("✅ No overdue loans found");
      return;
    }

    console.log(`⚠️  Found ${overdueLoans.length} overdue loan(s):`);
    for (const loanId of overdueLoans) {
      const loan = loans[loanId];
      const daysOverdue = Math.floor((block.timestamp - (Number(loan.createdAt) + Number(loan.duration))) / 86400);
      console.log(`\n📋 Loan ID ${loanId}:`);
      console.log(`  Borrower: ${loan.borrower}`);
      console.log(`  Amount: ${ethers.formatEther(loan.amount)} ETH`);
      console.log(`  Due Date: ${new Date((Number(loan.createdAt) + Number(loan.duration)) * 1000).toLocaleString()}`);

      // Mark as defaulted
      console.log(`\nMarking loan ${loanId} as defaulted...`);
      const tx = await loanManager.markLoanDefaulted(loanId);
      const receipt = await tx.wait();
      console.log("✅ Loan marked as defaulted!");
      console.log("Transaction hash:", receipt.hash);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
