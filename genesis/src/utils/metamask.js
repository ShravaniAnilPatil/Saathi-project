export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return {
      address: accounts[0],
    };
  } catch (error) {
    console.error("Wallet connection error:", error);
    return null;
  }
};
