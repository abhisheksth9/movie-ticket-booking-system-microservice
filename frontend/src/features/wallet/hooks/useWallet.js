import { useQuery } from "@tanstack/react-query";
import { fetchWalletBalance, fetchTransactions } from "../api/walletApi";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: fetchWalletBalance,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: fetchTransactions,
  });
}