const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy GroupPool
  const GroupPool = await hre.ethers.getContractFactory("GroupPool");
  const groupPool = await GroupPool.deploy(); // deploy
  await groupPool.waitForDeployment?.();       // <-- safe fallback
  console.log("GroupPool deployed to:", groupPool.target ?? groupPool.address);

  // Deploy LoanFactory
  const LoanFactory = await hre.ethers.getContractFactory("LoanFactory");
  const factory = await LoanFactory.deploy(); // deploy
  await factory.waitForDeployment?.();        // <-- safe fallback
  console.log("LoanFactory deployed to:", factory.target ?? factory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
