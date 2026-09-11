import { useAuth } from "../features/auth/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500">Logged in as: {user?.name}</p>
      <p className="text-gray-400 text-sm mt-4">
        Reports, movie/showtime management, and user management coming soon.
      </p>
    </div>
  );
}