async function main() {
  const Lending = await ethers.getContractFactory("Lending");
  const lending = await Lending.deploy();

  await lending.waitForDeployment();

  console.log("Lending deployed to:", await lending.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
