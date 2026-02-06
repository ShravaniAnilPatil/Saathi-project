import { ethers } from "ethers";
import GroupPoolABI from "../contracts/GroupPool.json";
import LoanFactoryABI from "../contracts/LoanFactory.json";
import LoanContractABI from "../contracts/LoanContract.json";

// Replace with deployed addresses
export const GROUP_POOL_ADDRESS = "0x185eD25539C55a852D79CaE02567673B2370aE64";
export const LOAN_FACTORY_ADDRESS = "0x8aE4A49aB9bF152eFC96beFea7f1cCFd4b6339AC";

let provider, signer;

export const connectWallet = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    return signer;
  } else {
    alert("Install MetaMask!");
  }
};

// Contract instances
export const getGroupPoolContract = () => {
  return new ethers.Contract(GROUP_POOL_ADDRESS, GroupPoolABI.abi, signer);
};

export const getLoanFactoryContract = () => {
  return new ethers.Contract(LOAN_FACTORY_ADDRESS, LoanFactoryABI.abi, signer);
};

export const getLoanContract = (loanAddress) => {
  return new ethers.Contract(loanAddress, LoanContractABI.abi, signer);
};
