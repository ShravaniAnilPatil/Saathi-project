const hre = require("hardhat");

async function main() {
  const TrustScore = await hre.ethers.getContractFactory("TrustScore");

  const trustScore = await TrustScore.deploy({
    gasLimit: 3_000_000,
  });

  await trustScore.waitForDeployment();

  console.log("TrustScore deployed to:", await trustScore.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
