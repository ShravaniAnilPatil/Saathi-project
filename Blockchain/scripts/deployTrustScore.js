const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying TrustScore with admin:", deployer.address);

  const TrustScore = await hre.ethers.getContractFactory("TrustScore");
  const trustScore = await TrustScore.deploy({
    gasLimit: 3_000_000,
  });

  await trustScore.waitForDeployment();

  const address = await trustScore.getAddress();
  console.log("✅ TrustScore deployed to:", address);

  // Update your .env with this address
  console.log("\n📝 Update your .env with:");
  console.log(`TRUST_SCORE_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
