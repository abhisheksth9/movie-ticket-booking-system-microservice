// import { useTransactions } from "../hooks/useWallet";

// const typeStyles = {
//   payment: "text-red-600",
//   refund: "text-green-600",
//   topup: "text-green-600",
// };

// export default function TransactionHistory() {
//   const { data: transactions, isLoading, isError, error } = useTransactions();

//   if (isLoading) {
//     return <p className="text-gray-500 text-sm">Loading transactions...</p>;
//   }

//   if (isError) {
//     return (
//       <p className="text-red-600 text-sm">
//         Failed to load transactions: {error.response?.data?.message || error.message}
//       </p>
//     );
//   }

//   if (!transactions?.length) {
//     return <p className="text-gray-500 text-sm">No transactions yet.</p>;
//   }

//   return (
//     <div className="space-y-2">
//       {transactions.map((tx) => {
//         const isDebit = tx.type === "payment";
//         return (
//           <div
//             key={tx.id}
//             className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
//           >
//             <div>
//               <p className="text-sm text-gray-900">{tx.description}</p>
//               <p className="text-xs text-gray-400 mt-1">
//                 {new Date(tx.createdAt).toLocaleString()}
//               </p>
//             </div>
//             <p
//               className={`text-sm font-medium ${
//                 typeStyles[tx.type] || "text-gray-700"
//               }`}
//             >
//               {isDebit ? "-" : "+"}{Number(tx.amount).toLocaleString()}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   );
// }





import { useState } from "react";
import { useTransactions } from "../hooks/useWallet";

const typeStyles = {
  payment: "text-red-600",
  refund: "text-green-600",
  topup: "text-green-600",
};

export default function TransactionHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error } = useTransactions({ page, limit: 10 });

  const transactions = data?.transactions || [];
  const pagination = data?.pagination;

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

  if (!transactions.length) {
    return <p className="text-gray-500 text-sm">No transactions yet.</p>;
  }

  return (
    <div>
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
              <p className={`text-sm font-medium ${typeStyles[tx.type] || "text-gray-700"}`}>
                {isDebit ? "-" : "+"}{Number(tx.amount).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || isFetching}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={page >= pagination.totalPages || isFetching}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}