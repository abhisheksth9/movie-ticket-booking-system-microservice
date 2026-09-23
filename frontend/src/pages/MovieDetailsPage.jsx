import { useParams, Link } from "react-router-dom";
import { useMovie } from "../features/movies/hooks/useMovies";
import ShowtimeList from "../features/showtimes/components/ShowtimeList";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { data: movie, isLoading, isError, error } = useMovie(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <p className="text-gray-500 text-sm animate-pulse">Loading movie details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-xl mx-auto my-12 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600 font-medium">Failed to load movie</p>
        <p className="text-red-500 text-sm mt-1">
          {error?.response?.data?.message || error?.message || "An unexpected error occurred."}
        </p>
        <Link to="/" className="mt-4 inline-block text-xs text-indigo-600 hover:underline">
          ← Back to Movies
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Movie not found.</p>
        <Link to="/" className="mt-2 inline-block text-sm text-indigo-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Back to Movies
      </Link>

      <div className="mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-xl font-bold text-black mb-2">{movie.title}</h1>
        
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          {movie.genre && (
            <span className="bg-gray-100 text-black px-2.5 py-0.5 rounded-full text-xs font-medium">
              {movie.genre}
            </span>
          )}
          {movie.duration && <span>{movie.duration} mins</span>}
        </div>

        {movie.description && (
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {movie.description}
          </p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Available Showtimes</h2>
        <ShowtimeList movieId={id} />
      </div>
    </div>
  );
}