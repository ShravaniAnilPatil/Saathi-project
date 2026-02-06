import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contracts";
import { useWallet } from "./context/WalletContext";

export const useContract = () => {
  const { signer } = useWallet();

  if (!signer) return null;

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );
};
