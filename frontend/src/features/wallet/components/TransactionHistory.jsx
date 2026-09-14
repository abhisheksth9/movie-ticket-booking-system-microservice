import { useTransactions } from "../hooks/useWallet";

const typeStyles = {
  payment: "text-red-600",
  refund: "text-green-600",
  topup: "text-green-600",
};

export default function TransactionHistory() {
  const { data: transactions, isLoading, isError, error } = useTransactions();

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading transactions...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-sm">
        Failed to load transactions: {error.response?.data?.message || error.message}
      </p>
    );
  }

  if (!transactions?.length) {
    return <p className="text-gray-500 text-sm">No transactions yet.</p>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        const isDebit = tx.type === "payment";
        return (
          <div
            key={tx.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
          >
            <div>
              <p className="text-sm text-gray-900">{tx.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(tx.createdAt).toLocaleString()}
              </p>
            </div>
            <p
              className={`text-sm font-medium ${
                typeStyles[tx.type] || "text-gray-700"
              }`}
            >
              {isDebit ? "-" : "+"}{Number(tx.amount).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}