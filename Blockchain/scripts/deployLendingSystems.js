const hre = require("hardhat");

async function main() {
  const SafetyPool = await hre.ethers.getContractFactory("SafetyPool");
  const safetyPool = await SafetyPool.deploy();
  await safetyPool.waitForDeployment();

  console.log("SafetyPool deployed to:", await safetyPool.getAddress());

  // Deploy TrustScore
  const TrustScore = await hre.ethers.getContractFactory("TrustScore");
  const trustScore = await TrustScore.deploy();
  await trustScore.waitForDeployment();

  const trustScoreAddress = await trustScore.getAddress();
  console.log("TrustScore deployed to:", trustScoreAddress);

  // Deploy LoanManager with TrustScore address
  const LoanManager = await hre.ethers.getContractFactory("LoanManager");
  const loanManager = await LoanManager.deploy(trustScoreAddress);
  await loanManager.waitForDeployment();

  const loanManagerAddress = await loanManager.getAddress();
  console.log("LoanManager deployed to:", loanManagerAddress);

  console.log("\n📝 Update your .env with:");
  console.log(`TRUST_SCORE_ADDRESS=${trustScoreAddress}`);
  console.log(`LOAN_MANAGER_ADDRESS=${loanManagerAddress}`);
}

main().catch(console.error);
