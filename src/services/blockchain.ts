import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://rpc.sepolia.org";
const provider = new ethers.JsonRpcProvider(RPC_URL);

let wallet: ethers.Wallet | null = null;
let contract: ethers.Contract | null = null;

const privateKey = process.env.PRIVATE_KEY || "";
const contractAddress = process.env.CONTRACT_ADDRESS || "";

// Safely try to initialize the wallet and contract
try {
  // Check if the private key looks like a real 64-character hex key
  if (privateKey.length === 66 && privateKey.startsWith("0x")) {
    wallet = new ethers.Wallet(privateKey, provider);

    // Check if the contract address looks like a real Ethereum address
    if (ethers.isAddress(contractAddress)) {
      const contractABI = [
        "function recordDonation(string txRef, uint256 amount) public returns (bool)",
      ];
      contract = new ethers.Contract(contractAddress, contractABI, wallet);
    } else {
      console.warn(
        "⚠️ Blockchain Warning: CONTRACT_ADDRESS is invalid. Running in offline mode.",
      );
    }
  } else {
    console.warn(
      "⚠️ Blockchain Warning: PRIVATE_KEY is missing or invalid format. Running in offline mode.",
    );
  }
} catch (error) {
  console.error("❌ Blockchain initialization failed.", error);
}

// Safely record donations without crashing
export const recordDonationOnChain = async (txRef: string, amount: number) => {
  if (!contract) {
    console.warn(
      "⚠️ Offline Mode: Skipping blockchain transaction. Returning demo hash.",
    );
    // Return a fake hash so the database can still save the donation
    return "0x_demo_hash_" + Date.now();
  }

  try {
    const tx = await contract.recordDonation(txRef, amount);
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("❌ Transaction failed on the blockchain:", error);
    return "0x_failed_hash_" + Date.now();
  }
};

export { provider, wallet, contract };
