import { Link } from "react-router-dom";
import { useShowtimes } from "../hooks/useShowtimes";

export default function ShowtimeList({ movieId }) {
  const { data: showtimes, isLoading, isError, error } = useShowtimes(movieId);
  console.log("ShowtimeList:", { movieId, showtimes, isLoading, isError, error });
  
  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading showtimes...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-600 text-sm">
        Failed to load showtimes: {error.response?.data?.message || error.message}
      </p>
    );
  }

  if (!showtimes?.length) {
    return <p className="text-gray-500 text-sm">No showtimes scheduled for this movie.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {showtimes.map((showtime) => (
        <Link
          key={showtime.id}
          to={`/bookings/${showtime.id}`}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-center hover:border-indigo-400 hover:bg-indigo-50 transition"
        >
          <p className="font-medium text-gray-900">
            {new Date(showtime.startTime).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-500">
            {new Date(showtime.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" – "}
            {new Date(showtime.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-gray-400 text-xs mt-1">Theater {showtime.theaterId}</p>
          <p className="text-indigo-600 font-medium text-xs mt-1">{showtime.price}</p>
        </Link>
      ))}
    </div>
  );
}