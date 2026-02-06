const { ethers } = require("hardhat");

async function main() {
  const LOAN_MANAGER_ADDRESS = process.env.LOAN_MANAGER_ADDRESS || "0x";

  if (LOAN_MANAGER_ADDRESS === "0x") {
    throw new Error("Please set LOAN_MANAGER_ADDRESS in .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Viewing from:", signer.address);

  const loanManager = await ethers.getContractAt(
    "LoanManager",
    LOAN_MANAGER_ADDRESS,
    signer
  );

  const loans = await loanManager.getLoans();
  console.log("\n📋 All Loans:");
  console.log("=====================================");

  loans.forEach((loan, index) => {
    console.log(`\nLoan ID: ${index}`);
    console.log(`  Borrower: ${loan.borrower}`);
    console.log(`  Lender: ${loan.lender}`);
    console.log(`  Principal: ${ethers.formatEther(loan.amount)} ETH`);
    console.log(`  Interest Rate: ${(Number(loan.interestRate) / 100).toFixed(2)}%`);
    console.log(`  Duration: ${loan.duration} seconds`);
    console.log(`  Created: ${new Date(Number(loan.createdAt) * 1000).toLocaleString()}`);
    console.log(`  Funded: ${loan.funded}`);
    console.log(`  Withdrawn: ${loan.withdrawn}`);
    console.log(`  Repaid: ${loan.repaid}`);
  });

  console.log("\n=====================================");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
