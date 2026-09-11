import { useParams } from "react-router-dom";
import { useMovie } from "../features/movies/hooks/useMovies";
import ShowtimeList from "../features/showtimes/components/ShowtimeList";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { data: movie, isLoading, isError, error } = useMovie(id);

  if (isLoading) {
    return <p className="text-gray-500 text-center py-12">Loading movie...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-center py-12">
        Failed to load movie: {error.response?.data?.message || error.message}
      </p>
    );
  }

  if (!movie) {
    return <p className="text-gray-500 text-center py-12">Movie not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">{movie.title}</h1>
      {movie.genre && <p className="text-gray-500 mb-1">{movie.genre}</p>}
      {movie.duration && <p className="text-gray-400 text-sm mb-4">{movie.duration} min</p>}
      {movie.description && (
        <p className="text-gray-600 mb-6 max-w-2xl">{movie.description}</p>
      )}

      <h2 className="text-lg font-medium text-gray-900 mb-3">Showtimes</h2>
      <ShowtimeList movieId={id} />
    </div>
  );
}