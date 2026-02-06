const hre = require("hardhat");

async function main() {
  const GroupPool = await hre.ethers.getContractFactory("GroupPool");
  const groupPool = await GroupPool.deploy();
  await groupPool.deployed();

  console.log("GroupPool deployed to:", groupPool.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
