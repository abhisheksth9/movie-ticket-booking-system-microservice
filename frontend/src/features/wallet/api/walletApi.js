import axiosClient from "../../../api/axiosClient";

export const fetchWalletBalance = async () => {
  const { data } = await axiosClient.get("/api/payments/balance");
  return data;
};

export const fetchTransactions = async () => {
  const { data } = await axiosClient.get("/api/payments/transactions");
  return data;
};