import { ethers } from "hardhat";

async function main() {
  const contractFactory = await ethers.getContractFactory("MyNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const contract = await contractFactory.deploy("Test Name", "Test Symbol");
  await contract.deployed();
  console.log("Contract deployed to address:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
