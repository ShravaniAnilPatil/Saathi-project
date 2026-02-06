const { ethers } = require("hardhat");

async function main() {
  const TRUST_SCORE_ADDRESS = process.env.TRUST_SCORE_ADDRESS || "0x87F69F5F30B8B785F19059c212A8C93be66D7DA0";

  const [signer] = await ethers.getSigners();

  const trustScore = await ethers.getContractAt(
    "TrustScore",
    TRUST_SCORE_ADDRESS,
    signer
  );

  const admin = await trustScore.admin();
  console.log("TrustScore Admin:", admin);
  console.log("Current Signer:", signer.address);
  console.log("Is Admin:", admin.toLowerCase() === signer.address.toLowerCase());

  if (admin.toLowerCase() !== signer.address.toLowerCase()) {
    console.log("\n⚠️  You are not the admin! Only the admin can update trust scores.");
    console.log("Contact the admin to update trust scores or redeploy the contract.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
