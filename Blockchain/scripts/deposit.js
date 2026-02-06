const { ethers } = require("hardhat");

async function main() {
  const SAFETY_POOL_ADDRESS = "0xA925519F2D10E21c497c6383330ab6605285B98F";

  const [deployer] = await ethers.getSigners();
  console.log("Depositing from:", deployer.address);

  const safetyPool = await ethers.getContractAt(
    "SafetyPool",
    SAFETY_POOL_ADDRESS,
    deployer
  );

  const tx = await safetyPool.deposit({
    value: ethers.parseEther("0.02"),
  });

  await tx.wait();
  console.log("Deposit successful ✅");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
