import axiosClient from "../../../api/axiosClient";

export const fetchWalletBalance = async () => {
  const { data } = await axiosClient.get("/api/payments/balance");
  return data;
};

export const fetchTransactions = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await axiosClient.get("/api/payments/transactions", {
    params: { page, limit },
  });
  return data;
};