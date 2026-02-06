const hre = require("hardhat");

async function main() {
  const [sender] = await hre.ethers.getSigners();

  const receiverAddress = "0x6f778262d788528FB33a4Ad0A278e6d144AdA0f0"; // change this
  const amountInEth = "0.01"; // small amount for test

  console.log("Sender:", sender.address);
  console.log("Receiver:", receiverAddress);

  const tx = await sender.sendTransaction({
    to: receiverAddress,
    value: hre.ethers.parseEther(amountInEth),
  });

  console.log("Transaction hash:", tx.hash);

  await tx.wait();
  console.log("Transaction confirmed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
