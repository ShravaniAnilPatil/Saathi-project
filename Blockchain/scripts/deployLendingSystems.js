const hre = require("hardhat");

async function main() {
  const SafetyPool = await hre.ethers.getContractFactory("SafetyPool");
  const safetyPool = await SafetyPool.deploy();
  await safetyPool.waitForDeployment();

  console.log("SafetyPool deployed to:", await safetyPool.getAddress());

  const trustScoreAddress ="0x87F69F5F30B8B785F19059c212A8C93be66D7DA0";

  const Lending = await hre.ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(
    trustScoreAddress,
    await safetyPool.getAddress()
  );

  await lending.waitForDeployment();

  console.log("Lending deployed to:", await lending.getAddress());
}

main().catch(console.error);
