const hre = require("hardhat");

async function main() {
  // 1️⃣ Get the contract factory
  const LoanContract = await hre.ethers.getContractFactory("LoanContract");

  // 2️⃣ Dynamic addresses / values
  const borrower = "0x1b46C1954361A8cB698711426fFaf4f0B1b0f039";
  const groupPool = "0x185eD25539C55a852D79CaE02567673B2370aE64";
  const duration = 7 * 24 * 60 * 60; // 7 days
 const principal = hre.ethers.parseEther("0.01"); // 0.01 ETH instead of 0.1 ETH
const interest = hre.ethers.parseEther("0.001"); // 0.001 ETH interest


  // 3️⃣ Deploy contract with constructor args and principal
  const loan = await LoanContract.deploy(
    borrower,
    groupPool,
    interest,
    duration,
    { value: principal } // fund principal
  );

  // 4️⃣ Wait for deployment
  await loan.waitForDeployment?.(); // optional in Hardhat 3.x

  // 5️⃣ Log deployed address
  console.log("LoanContract deployed at:", loan.target ?? loan.address);
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
