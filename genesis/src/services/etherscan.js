const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
const BASE_URL = "https://api-sepolia.etherscan.io/api";

const BASE_URL2 = "https://api.etherscan.io/v2/api";
const SEPOLIA_CHAIN_ID = 11155111;

export const getWalletBalance = async (address) => {
  const url = `${BASE_URL2}?chainid=${SEPOLIA_CHAIN_ID}&module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  console.log("Balance API V2:", data);

  if (data.status !== "1") {
    throw new Error(data.result || "Balance fetch failed");
  }

  return data.result; // wei (string)
};


export const getWalletTransactions = async (address) => {
  try {
    const url =
      `https://api.etherscan.io/v2/api` +
      `?chainid=11155111` +
      `&module=account` +
      `&action=txlist` +
      `&address=${address}` +
      `&startblock=0` +
      `&endblock=99999999` +
      `&sort=desc` +
      `&apikey=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("TX API:", data);

    if (data.status !== "1") {
      console.warn("No tx:", data.message);
      return [];
    }

    return data.result;
  } catch (err) {
    console.error("TX fetch error:", err);
    return [];
  }
};
