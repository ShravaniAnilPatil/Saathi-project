const { ethers } = require("hardhat");

async function main() {
  // You need to deploy TrustScore separately or get its address from deployment
  // For now, using a placeholder - update with your actual TrustScore address
  const TRUST_SCORE_ADDRESS = process.env.TRUST_SCORE_ADDRESS || "0x87F69F5F30B8B785F19059c212A8C93be66D7DA0";

  const [admin] = await ethers.getSigners();
  console.log("Admin address:", admin.address);

  const trustScore = await ethers.getContractAt(
    "TrustScore",
    TRUST_SCORE_ADDRESS,
    admin
  );

  // Get the user address to update (can be set via env variable or command line)
  const userAddress = process.env.USER_ADDRESS || admin.address;
  const score = parseInt(process.env.SCORE || "50");

  console.log(`\nUpdating trust score:`);
  console.log(`  User: ${userAddress}`);
  console.log(`  Score: ${score}`);

  const tx = await trustScore.updateScore(userAddress, score);
  const receipt = await tx.wait();

  console.log("✅ Trust score updated successfully!");
  console.log("Transaction hash:", receipt.hash);

  // Verify the update
  const newScore = await trustScore.getScore(userAddress);
  console.log(`New score: ${newScore}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
