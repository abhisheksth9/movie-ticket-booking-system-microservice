import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import MovieList from "../features/movies/components/MovieList";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Now Showing</h1>
          {!isLoading && (
            <p className="text-gray-500 text-sm mt-1">
              {user ? `Welcome back, ${user.name}!` : "Sign in to book tickets."}
            </p>
          )}
        </div>

        {/* Quick-access button for Admins */}
        {user?.role?.toLowerCase() === "admin" && (
          <Link
            to="/admin"
            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
          >
            Admin Dashboard →
          </Link>
        )}
      </div>

      <MovieList />
    </div>
  );
}