import { ethers } from "ethers";

const contractAddress = "0xAB9A2c6623b552C3Df4140BAa5989f16D4CB5c72";

const abi = [
  "function getScore(address user) view returns (uint256)",
  "function updateScore(address user, uint256 score)"
];

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(contractAddress, abi, signer);
};
