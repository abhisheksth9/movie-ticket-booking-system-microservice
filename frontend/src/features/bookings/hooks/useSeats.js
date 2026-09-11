import { useQuery } from "@tanstack/react-query";
import { fetchSeatsByTheater, fetchBookedSeats } from "../api/bookingsApi";

export function useSeats(theaterId) {
  return useQuery({
    queryKey: ["seats", theaterId],
    queryFn: () => fetchSeatsByTheater(theaterId),
    enabled: !!theaterId,
  });
}

export function useBookedSeats(showtimeId) {
  return useQuery({
    queryKey: ["bookedSeats", showtimeId],
    queryFn: () => fetchBookedSeats(showtimeId),
    enabled: !!showtimeId,
  });
}