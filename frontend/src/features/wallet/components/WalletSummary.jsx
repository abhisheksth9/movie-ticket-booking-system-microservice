import { useWalletBalance } from "../hooks/useWallet";
import TransactionHistory from "./TransactionHistory";

export default function WalletSummary() {
  const { data, isLoading } = useWalletBalance();

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-sm mb-6">
        <p className="text-sm text-gray-500">Wallet Balance</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">
          {isLoading ? "..." : `${Number(data?.balance || 0).toLocaleString()}`}
        </p>
      </div>

      <h3 className="text-md font-medium text-gray-900 mb-3">Transaction History</h3>
      <TransactionHistory />
    </div>
  );
}