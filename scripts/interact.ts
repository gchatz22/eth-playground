import { ethers } from "hardhat";
import contract from "../artifacts/contracts/HelloWorld.sol/HelloWorld.json";
import * as dotenv from "dotenv";
import { Contract } from "ethers";

dotenv.config();

const alchemyProvider = new ethers.providers.AlchemyProvider(
  "goerli",
  process.env.API_KEY
);
const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY || "",
  alchemyProvider
);
const helloWorldContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS || "",
  contract.abi,
  signer
);

const readMessage = async () => {
  const message = await helloWorldContract.message();
  console.log("The message is: " + message);
};

const updateMessage = async (newMessage: string) => {
  console.log("Updating the message...");
  const tx = await helloWorldContract.update(newMessage);
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
