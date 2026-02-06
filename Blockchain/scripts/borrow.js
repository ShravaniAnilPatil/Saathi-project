const { ethers } = require("hardhat");

async function main() {
  const LOAN_MANAGER_ADDRESS = process.env.LOAN_MANAGER_ADDRESS || "0x";

  if (LOAN_MANAGER_ADDRESS === "0x") {
    throw new Error("Please set LOAN_MANAGER_ADDRESS in .env");
  }

  const [borrower] = await ethers.getSigners();
  console.log("Borrower:", borrower.address);

  const loanManager = await ethers.getContractAt(
    "LoanManager",
    LOAN_MANAGER_ADDRESS,
    borrower
  );

  // Get trust score first
  try {
    const trustScore = await loanManager.trustScoreContract().then(addr =>
      ethers.getContractAt("ITrustScore", addr)
    );
    const score = await trustScore.getScore(borrower.address);
    console.log("Trust Score:", score.toString());
  } catch (e) {
    console.log("Could not fetch trust score");
  }

  // Create a loan request
  const amount = ethers.parseEther("0.01");
  const duration = 7 * 24 * 60 * 60; // 7 days in seconds

  console.log(`Creating loan request for ${ethers.formatEther(amount)} ETH with ${duration}s duration...`);

  const tx = await loanManager.createLoan(amount, duration);
  const receipt = await tx.wait();

  console.log("✅ Loan request created successfully!");
  console.log("Transaction hash:", receipt.hash);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
