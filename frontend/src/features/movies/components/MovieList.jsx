import { useMovies } from "../hooks/useMovies";
import MovieCard from "./MovieCard";

export default function MovieList() {
  const { data: movies, isLoading, isError, error } = useMovies();

  if (isLoading) {
    return <p className="text-gray-500 text-center py-12">Loading movies...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-center py-12">
        Failed to load movies: {error.response?.data?.message || error.message}
      </p>
    );
  }

  if (!movies?.length) {
    return <p className="text-gray-500 text-center py-12">No movies available right now.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}