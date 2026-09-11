import { useQuery } from "@tanstack/react-query";
import { fetchShowtimesByMovie, fetchShowtimeById } from "../api/showtimesApi";

export function useShowtimes(movieId) {
  return useQuery({
    queryKey: ["showtimes", "movie", movieId],
    queryFn: () => fetchShowtimesByMovie(movieId),
    enabled: !!movieId,
  });
}

export function useShowtimeById(showtimeId) {
  return useQuery({
    queryKey: ["showtimes", showtimeId],
    queryFn: () => fetchShowtimeById(showtimeId),
    enabled: !!showtimeId,
  });
}