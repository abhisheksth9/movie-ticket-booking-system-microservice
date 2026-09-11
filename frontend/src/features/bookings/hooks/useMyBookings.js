import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyBookings, cancelBooking } from "../api/bookingsApi";

export function useMyBookings() {
    return useQuery({
        queryKey: ["myBookings"],
        queryFn: fetchMyBookings,
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myBookings"] });
        },
    });
}