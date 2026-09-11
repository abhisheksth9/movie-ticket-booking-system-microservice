import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../features/auth/AuthContext";
import { NotificationsProvider } from "../features/notifications/NotificationsContext";

const queryClient = new QueryClient();

export function AppProviders({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotificationsProvider> {children} </NotificationsProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}