import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTheaters, createTheater } from "../api/adminTheatersApi";

export function useTheaters() {
  return useQuery({
    queryKey: ["theaters"],
    queryFn: fetchTheaters,
  });
}

export function useCreateTheater() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTheater,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
  });
}