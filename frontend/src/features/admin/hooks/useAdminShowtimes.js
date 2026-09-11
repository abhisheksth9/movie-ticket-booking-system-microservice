import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShowtime, deleteShowtime } from "../api/adminShowtimesApi";

export function useCreateShowtime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShowtime,
    onSuccess: (_, variables) => {
      // Invalidate the movie-specific showtime list and the all-showtimes cache
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
}

export function useDeleteShowtime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
}