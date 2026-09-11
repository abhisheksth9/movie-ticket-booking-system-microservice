import { useState } from "react";
import MovieManagement from "../features/admin/components/MovieManagement";
import TheaterManagement from "../features/admin/components/TheaterManagement";
import ShowtimeManagement from "../features/admin/components/ShowtimeManagement";

const TABS = [
  { key: "movies", label: "Movies" },
  { key: "theaters", label: "Theaters" },
  { key: "showtimes", label: "Showtimes" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("movies");

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "movies" && <MovieManagement />}
      {activeTab === "theaters" && <TheaterManagement />}
      {activeTab === "showtimes" && <ShowtimeManagement />}
    </div>
  );
}