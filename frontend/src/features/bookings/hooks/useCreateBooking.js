import { useMutation } from "@tanstack/react-query";
import { createBooking } from "../api/bookingsApi";

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  });
}