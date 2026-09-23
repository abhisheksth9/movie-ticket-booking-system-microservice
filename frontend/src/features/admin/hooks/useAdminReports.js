import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReports,
  fetchReportByDate,
  regenerateReport,
  downloadReportPdf,
} from "../api/adminReportsApi";

export function useReports(params) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => fetchReports(params),
    keepPreviousData: true, // smooth pagination — no flash of loading state between pages
  });
}

export function useReportByDate(date) {
  return useQuery({
    queryKey: ["reports", "single", date],
    queryFn: () => fetchReportByDate(date),
    enabled: !!date,
  });
}

export function useRegenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: regenerateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}