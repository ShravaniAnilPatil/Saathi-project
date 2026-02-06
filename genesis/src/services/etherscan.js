const API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;

export const getWalletTransactions = async (address) => {
  if (!API_KEY) {
    console.error("Etherscan API key not configured. Check VITE_ETHERSCAN_API_KEY in .env");
    return [];
  }

  if (!address) {
    console.error("No wallet address provided");
    return [];
  }

  try {
    const url = `https://api.etherscan.io/v2/api
    ?chainid=11155111
    &module=account
    &action=txlist
    &address=${address}
    &startblock=0
    &endblock=99999999
    &sort=desc
    &apikey=${API_KEY}`.replace(/\s+/g, "");


    const res = await fetch(url);
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    console.log("Etherscan response:", data);

    if (data.status !== "1") {
      console.warn(`Etherscan error: ${data.message || "Unknown error"}`);
      return [];
    }

    return data.result || [];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};
