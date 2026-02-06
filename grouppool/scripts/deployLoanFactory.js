const hre = require("hardhat");

async function main() {
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
