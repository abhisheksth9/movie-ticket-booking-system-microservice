import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { getAccessToken } from "../../api/interceptors";

const NotificationsContext = createContext(null);

const NOTIFICATION_SOCKET_URL = import.meta.env.VITE_NOTIFICATION_SOCKET_URL || "http://localhost:4005";

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      return;
    }

    const token = getAccessToken();
    if (!token) return; 
    const socket = io(NOTIFICATION_SOCKET_URL, {
      auth: { token },
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("notification", (notification) => {
      if (notification.type === "welcome") return;
      queryClient.setQueryData(["notifications"], (old = []) => [
        notification,
        ...old,
      ]);
    });

    socket.on("connect_error", (err) => {
      console.error("Notification socket connection error:", err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, queryClient]);

  return (
    <NotificationsContext.Provider value={{ isConnected }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsSocket() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsSocket must be used within NotificationsProvider");
  return ctx;
}