import { ethers } from "hardhat";
import contractInfo from "../../artifacts/contracts/CandyMachine.sol/CandyMachine.json";

const provider = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.API_KEY
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

// Get contract ABI and address
const abi = contractInfo.abi;
const contractAddress = "0x0A8111CdD30F1E363337F06222037B94f327da18";

// Create a contract instance
const contract = new ethers.Contract(contractAddress, abi, signer);

const getTokenMetadata = async (tokenId: number) => {
  console.log("Fetching metadata...");
  const metadata = await contract.fetchConfigLines();
  console.log(metadata);
};

async function main() {
  await getTokenMetadata(14);
}

main().catch((error) => {
  console.error(error);
});
