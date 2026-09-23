import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axiosClient from "../../api/axiosClient";
import { setAccessToken, setupInterceptors } from "../../api/interceptors";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasBootstrapped = useRef(false);

  const logout = useCallback(async () => {
    try {
      await axiosClient.post("/api/auth/logout");
    } catch {
      // ignore - clear local state 
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setupInterceptors(logout);

    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const bootstrapSession = async () => {
      try {
        const { data } = await axiosClient.post("/api/auth/refresh");
        setAccessToken(data.accessToken);

        const me = await axiosClient.get("/api/auth/me");
        setUser(me.data);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapSession();
  }, [logout]);

  const login = async (email, password, role = "user") => {
    // 1. Select endpoint according to role passed from form
    const endpoint = role === "admin" ? "/api/auth/admin/login" : "/api/auth/login";
    
    // 2. Perform Post request
    const { data } = await axiosClient.post(endpoint, { email, password });
    
    // 3. Set Bearer token in Axios instance
    setAccessToken(data.accessToken);

    // 4. Safely extract user object (handles flattened response OR nested user object)
    const rawUser = data.user || data;
    const currentUser = {
      id: rawUser.id || rawUser._id,
      name: rawUser.name,
      email: rawUser.email,
      role: rawUser.role || role // Fallback to provided role if backend omits it
    };

    setUser(currentUser);
    
    // Return the normalized user object so component handlers can use currentUser.role
    return currentUser;
  };

  const register = async (name, email, password, role = "user") => {
    const endpoint = role === "admin" ? "/api/auth/admin/register" : "/api/auth/register";
    const { data } = await axiosClient.post(endpoint, { name, email, password });
    
    setAccessToken(data.accessToken);

    const rawUser = data.user || data;
    const currentUser = {
      id: rawUser.id || rawUser._id,
      name: rawUser.name,
      email: rawUser.email,
      role: rawUser.role || role
    };

    setUser(currentUser);
    return currentUser;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}