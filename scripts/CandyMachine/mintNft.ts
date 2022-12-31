import { ethers } from "hardhat";
import contractInfo from "../../artifacts/contracts/CandyMachine.sol/CandyMachine.json";

const provider = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.API_KEY
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

// Get contract ABI and address
const abi = contractInfo.abi;
const contractAddress = "0xd993aeCd2A09352983f166283a88B775AE1CE4D8";

// Create a contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);

const mintNft = async () => {
  console.log("Minting token...");
  const amountOfTokensRemaining = await contract.tokensRemainingAmount();
  console.log("amountOfTokensRemaining", amountOfTokensRemaining.toString());
  const tx = await contract.mintNFT(signer.address);
  await tx.wait();
  console.log(`Minted token! https://goerli.etherscan.io/tx/${tx.hash}`);
  const mintedTokensAmount = (await contract.mintedTokensAmount()) - 1;
  console.log("Number(mintedTokensAmount)", Number(mintedTokensAmount));
  const metadata = await contract.tokenURI(Number(mintedTokensAmount));
  console.log("metadata", metadata);
};

async function main() {
  await mintNft();
}

main().catch((error) => {
  console.error(error);
});
