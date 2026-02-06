const { ethers } = require("hardhat");

async function main() {
  const LOAN_MANAGER_ADDRESS = process.env.LOAN_MANAGER_ADDRESS || "0x";

  if (LOAN_MANAGER_ADDRESS === "0x") {
    throw new Error("Please set LOAN_MANAGER_ADDRESS in .env");
  }

  const [signer] = await ethers.getSigners();

  const loanManager = await ethers.getContractAt(
    "LoanManager",
    LOAN_MANAGER_ADDRESS,
    signer
  );

  try {
    const repaymentBonus = await loanManager.repaymentBonus();
    const defaultPenalty = await loanManager.defaultPenalty();

    console.log("Trust Score Configuration");
    console.log("==========================");
    console.log(`Repayment Bonus: +${repaymentBonus} points for successful repayment`);
    console.log(`Default Penalty: -${defaultPenalty} points for defaulted loan`);
    console.log();

    // Show tiers
    console.log("Interest Rate Tiers (based on Trust Score)");
    console.log("==========================================");
    const scores = [90, 75, 60, 50, 40];
    for (const score of scores) {
      const rate = await loanManager.getInterestRate(score);
      const ratePercent = (Number(rate) / 100).toFixed(2);
      console.log(`Score ${score}: ${ratePercent}% interest rate`);
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
