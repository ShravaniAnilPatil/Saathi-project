const { ethers } = require("hardhat");

async function main() {

  const trustScoreAddress = "0xAB9A2c6623b552C3Df4140BAa5989f16D4CB5c72";

  const LoanManager = await ethers.getContractFactory("LoanManager");

  const loanManager = await LoanManager.deploy(trustScoreAddress);

  await loanManager.waitForDeployment();

  console.log("LoanManager deployed to:", await loanManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
