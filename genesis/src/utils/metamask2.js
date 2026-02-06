import { BrowserProvider } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return {
      address: accounts[0],
      provider,
      signer,
    };

  } catch (error) {
    console.error("Wallet connection error:", error);
    return null;
  }
};
