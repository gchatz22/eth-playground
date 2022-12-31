import { ethers } from "hardhat";
import contractInfo from "../../artifacts/contracts/HelloWorld.sol/HelloWorld.json";
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

const readMessage = async () => { 
  const message = await contract.message();
  console.log("The message is: " + message);
};

const updateMessage = async (newMessage: string) => {
  console.log("Updating the message...");
  const tx = await contract.update(newMessage);
  await tx.wait();
};

async function main() {
  await readMessage();

  await updateMessage("Giannis test");

  await readMessage();
}

main().catch((error) => {
  console.error(error);
});
