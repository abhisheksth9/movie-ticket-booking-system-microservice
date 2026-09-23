import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import BookingHistory from "../features/bookings/components/BookingHistory";
import WalletSummary from "../features/wallet/components/WalletSummary";

const TABS = [
  { key: "bookings", label: "My Tickets" },
  { key: "transactions", label: "Transaction History" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 capitalize border border-indigo-100">
              {user?.role} Account
            </span>
          </div>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            Go to Admin Dashboard
          </Link>
        )}
      </div> */}

      {/* Admin View vs User Tabbed View */}
      {isAdmin ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
          <p className="text-sm">You are logged in as an Administrator.</p>
          <p className="text-xs text-gray-400 mt-1">Manage movies, theaters, and bookings directly in the Admin Panel.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          {/* Tab Navigation Bar */}
          <div className="flex border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 px-4 text-sm font-semibold transition border-b-2 relative -mb-px ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div>
            {activeTab === "bookings" && <BookingHistory />}
            {activeTab === "transactions" && <WalletSummary />}
          </div>
        </div>
      )}
    </div>
  );
}