import { useShowtimeById } from "../../showtimes/hooks/useShowtimes";
import { useMovie } from "../../movies/hooks/useMovies";
import { useSeats } from "./useSeats";

export function useBookingTicket(booking) {
  const { data: showtime, isLoading: showtimeLoading } = useShowtimeById(booking.showtimeId);
  const { data: movie, isLoading: movieLoading } = useMovie(showtime?.movieId);
  const { data: theaterData, isLoading: seatsLoading } = useSeats(showtime?.theaterId);

  const isLoading = showtimeLoading || (!!showtime && (movieLoading || seatsLoading));

  const seatNumbers = booking.BookingSeats.map((bs) => {
    const seat = theaterData?.seats?.find((s) => s.id === bs.seatId);
    return seat?.seatNumber || `#${bs.seatId}`;
  });

  return {
    isLoading,
    movieTitle: movie?.title,
    theaterName: theaterData?.theater,
    theaterLocation: theaterData?.location,
    startTime: showtime?.startTime,
    seatNumbers,
  };
}