const hre = require("hardhat");

async function main() {
  // Deploy GroupPool
  const GroupPool = await hre.ethers.getContractFactory("GroupPool");
  const groupPool = await GroupPool.deploy();
  await groupPool.deployed();
  console.log("GroupPool deployed to:", groupPool.address);

  // Deploy LoanFactory
  const LoanFactory = await hre.ethers.getContractFactory("LoanFactory");
  const factory = await LoanFactory.deploy();
  await factory.deployed();
  console.log("LoanFactory deployed to:", factory.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
