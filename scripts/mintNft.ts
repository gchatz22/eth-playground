import { ethers } from "hardhat";
import contract from "../artifacts/contracts/MyNft.sol/MyNFT.json";

const provider = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.API_KEY
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const tokenUri =
  "https://gateway.pinata.cloud/ipfs/QmThC8CU5hTMEifvsbyByn2pxoGaV9VQHnSS2tTqPgcxFj";

// Get contract ABI and address
const abi = contract.abi;
const contractAddress = "0x0E3B977824195940b607A5BB7074c47B00256535";

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

const mintNft = async () => {
  console.log("Minting token...");
  const tx = await myNftContract.mintNFT(signer.address, tokenUri);
  await tx.wait();
  console.log(`Minted token! https://goerli.etherscan.io/tx/${tx.hash}`);
};

async function main() {
  await mintNft();
}

main().catch((error) => {
  console.error(error);
});
