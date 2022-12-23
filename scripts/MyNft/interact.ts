import { ethers } from "hardhat";
import contractInfo from "../../artifacts/contracts/MyNft.sol/MyNFT.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.API_KEY
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const contract = new ethers.Contract(
  "0x0e3b977824195940b607a5bb7074c47b00256535",
  contractInfo.abi,
  signer
);

const readMetadata = async (tokenId: number) => {
  const tokenUri = await contract.tokenURI(tokenId);
  console.log("The token uri is: " + tokenUri);
};

async function main() {
  const tokenId = 2;
  await readMetadata(tokenId);
}

main().catch((error) => {
  console.error(error);
});
