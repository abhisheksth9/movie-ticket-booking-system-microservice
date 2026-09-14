import { useWalletBalance } from "../hooks/useWallet";

export default function WalletBadge() {
  const { data, isLoading } = useWalletBalance();

  if (isLoading) return null;

  return (
    <span className="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-xs font-medium">
      {Number(data?.balance || 0).toLocaleString()}
    </span>
  );
}