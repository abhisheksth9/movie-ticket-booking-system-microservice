import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
    >
      <div className="w-full h-48 bg-indigo-50 flex items-center justify-center">
        <span className="text-4xl font-semibold text-indigo-300">
          {movie.title?.charAt(0)?.toUpperCase()}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{movie.title}</h3>
        {movie.genre && (
          <p className="text-sm text-gray-500 mt-1">{movie.genre}</p>
        )}
        {movie.duration && (
          <p className="text-xs text-gray-400 mt-1">{movie.duration} min</p>
        )}
      </div>
    </Link>
  );
}