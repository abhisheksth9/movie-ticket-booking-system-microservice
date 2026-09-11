import { useAuth } from "../features/auth/AuthContext";
import MovieList from "../features/movies/components/MovieList";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Now Showing</h1>

      {!isLoading && (
        <p className="text-gray-500 text-sm mb-4">
          {user ? `Welcome back, ${user.name}` : "Sign in to book tickets."}
        </p>
      )}

      <MovieList />
    </div>
  );
}