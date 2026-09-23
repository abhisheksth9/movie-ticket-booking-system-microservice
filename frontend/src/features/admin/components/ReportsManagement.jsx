import { useState } from "react";
import { useReports, useRegenerateReport } from "../hooks/useAdminReports";
import { downloadReportPdf } from "../api/adminReportsApi";

export default function ReportsManagement() {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [downloadingDate, setDownloadingDate] = useState(null);
  const [error, setError] = useState("");

  const { data, isLoading, isFetching } = useReports({
    page,
    limit: 10,
    from: dateRange.from || undefined,
    to: dateRange.to || undefined,
  });
  const regenerateReport = useRegenerateReport();

  const reports = data?.reports || [];
  const pagination = data?.pagination;

  const handleRegenerate = async (date) => {
    setError("");
    try {
      await regenerateReport.mutateAsync(date);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to regenerate report for ${date}.`);
    }
  };

  const handleDownload = async (date) => {
    setError("");
    setDownloadingDate(date);
    try {
      const blob = await downloadReportPdf(date);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`No PDF export found for ${date}.`);
    } finally {
      setDownloadingDate(null);
    }
  };

  const handleFilterChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    setPage(1); // reset to first page when filter changes
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Daily Reports</h2>

      <div className="flex gap-3 mb-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input
            type="date"
            name="from"
            value={dateRange.from}
            onChange={handleFilterChange}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input
            type="date"
            name="to"
            value={dateRange.to}
            onChange={handleFilterChange}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 max-w-md">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading reports...</p>
      ) : !reports.length ? (
        <p className="text-gray-500 text-sm">No reports found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">New Users</th>
                <th className="py-2 pr-4">Logins</th>
                <th className="py-2 pr-4">Bookings</th>
                <th className="py-2 pr-4">Revenue</th>
                <th className="py-2 pr-4">Refunds</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-900">{report.date}</td>
                  <td className="py-2 pr-4">{report.newUsers}</td>
                  <td className="py-2 pr-4">{report.logins}</td>
                  <td className="py-2 pr-4">
                    {report.bookingsCreated} created / {report.bookingsCancelled} cancelled
                  </td>
                  <td className="py-2 pr-4">{Number(report.totalRevenue).toLocaleString()}</td>
                  <td className="py-2 pr-4">{Number(report.totalRefunded).toLocaleString()}</td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRegenerate(report.date)}
                        disabled={regenerateReport.isPending}
                        className="text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                      >
                        Regenerate
                      </button>
                      <button
                        onClick={() => handleDownload(report.date)}
                        disabled={downloadingDate === report.date}
                        className="text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50"
                      >
                        {downloadingDate === report.date ? "Downloading..." : "Download PDF"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || isFetching}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={page >= pagination.totalPages || isFetching}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}