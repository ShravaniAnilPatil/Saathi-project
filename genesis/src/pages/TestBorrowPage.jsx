import { connectWallet } from "../utils/metamask";
import BorrowForm from "../components/BorrowForm";

const TestBorrowPage = () => {

  const handleConnect = async () => {
    await connectWallet();
    window.location.reload(); // refresh so BorrowForm reads wallet
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Borrow Testing Page 🧪</h1>

      {!localStorage.getItem("walletAddress") ? (
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected: {localStorage.getItem("walletAddress")}</p>
          <BorrowForm />
        </>
      )}
    </div>
  );
};

export default TestBorrowPage;
