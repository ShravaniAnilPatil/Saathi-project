const { ethers } = require("hardhat");

async function main() {
  const LENDING_ADDRESS = "0x5ac2184d783db06b9dedf80ce9b5b1aeb02392c3";

  const [borrower] = await ethers.getSigners();
  console.log("Borrower:", borrower.address);

  const lending = await ethers.getContractAt(
    "LendingSystem",
    LENDING_ADDRESS,
    borrower
  );

  const amount = ethers.parseEther("0.01");

  const tx = await lending.borrow(amount);
  await tx.wait();

  console.log("Borrow successful 💸");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
