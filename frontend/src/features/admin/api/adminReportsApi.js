import axiosClient from "../../../api/axiosClient";

export const fetchReports = async ({ page = 1, limit = 10, from, to } = {}) => {
  const { data } = await axiosClient.get("/api/reports", {
    params: { page, limit, from, to },
  });
  return data;
};

export const fetchReportByDate = async (date) => {
  const { data } = await axiosClient.get(`/api/reports/${date}`);
  return data;
};

export const regenerateReport = async (date) => {
  const { data } = await axiosClient.post(`/api/reports/${date}/regenerate`);
  return data;
};

export const downloadReportPdf = async (date) => {
  const response = await axiosClient.get(`/api/reports/${date}/download`, {
    responseType: "blob",
  });
  return response.data;
};