import { ethers } from "hardhat";
import contractInfo from "../../artifacts/contracts/CandyMachine.sol/CandyMachine.json";
import * as dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.API_KEY
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const contractAddress = "0x0A8111CdD30F1E363337F06222037B94f327da18";
const contract = new ethers.Contract(contractAddress, contractInfo.abi, signer);

const addConfigLine = async (tokenUri: string) => {
  const tx = await contract.addConfigLine(tokenUri);
  await tx.wait();
};
const configLines = [
  "https://metadata.degods.com/g/4.json",
  "https://metadata.degods.com/g/5711.json",
  "https://metadata.degods.com/g/3742.json",
  "https://metadata.degods.com/g/8318.json",
  // "https://metadata.degods.com/g/6518.json",
  // "https://metadata.degods.com/g/9999.json",
  // "https://metadata.degods.com/g/7777.json",
];

async function main() {
  for (let i = 0; i < configLines.length; i++) {
    const configLine = configLines[i];
    console.log(`Adding config line ${i + 1}...`);
    await addConfigLine(configLine);
  }
}

main().catch((error) => {
  console.error(error);
});
