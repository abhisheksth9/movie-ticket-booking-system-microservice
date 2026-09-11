import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyNotifications, markNotificationRead } from "../api/notificationsApi";

export function useNotificationsHistory() {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: fetchMyNotifications,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: markNotificationRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}