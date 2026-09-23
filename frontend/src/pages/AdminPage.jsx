import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import MovieManagement from "../features/admin/components/MovieManagement";
import TheaterManagement from "../features/admin/components/TheaterManagement";
import ShowtimeManagement from "../features/admin/components/ShowtimeManagement";
import ReportsManagement from "../features/admin/components/ReportsManagement";

const TABS = [
  { key: "movies", label: "Movies" },
  { key: "theaters", label: "Theaters" },
  { key: "showtimes", label: "Showtimes" },
  { key: "reports", label: "Reports" },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("movies");

  // Fallback safety check
  if (user?.role?.toLowerCase() !== "admin") {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold text-red-600">Access Denied</h2>
        <p className="text-gray-500 text-sm mt-1">
          You do not have administrative privileges to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          Admin Mode
        </span>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
        {activeTab === "movies" && <MovieManagement />}
        {activeTab === "theaters" && <TheaterManagement />}
        {activeTab === "showtimes" && <ShowtimeManagement />}
        {activeTab === "reports" && <ReportsManagement />}
      </div>
    </div>
  );
}