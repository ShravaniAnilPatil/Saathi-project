// import { createContext, useContext, useState } from "react";

// const WalletContext = createContext();

// export const WalletProvider = ({ children }) => {
//   const [walletAddress, setWalletAddress] = useState(null);

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       alert("MetaMask not installed");
//       return;
//     }

//     try {
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       // 👇 WALLET ADDRESS COMES FROM METAMASK
//       setWalletAddress(accounts[0]);
//     } catch (error) {
//       console.error("Wallet connection failed", error);
//     }
//   };

//   return (
//     <WalletContext.Provider value={{ walletAddress, connectWallet }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };

// export const useWallet = () => useContext(WalletContext);


import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const walletSigner = await browserProvider.getSigner();

      setWalletAddress(accounts[0]);
      setProvider(browserProvider);
      setSigner(walletSigner);
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{ walletAddress, provider, signer, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
