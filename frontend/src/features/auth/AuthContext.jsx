import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axiosClient";
import { setAccessToken, setupInterceptors } from "../../api/interceptors";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }){
    const [ user, setUser ] = useState(null);
    const [ isLeading, setIsLoading ] = useState(true);

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
        const endpoint = role === "admin" ? "/api/auth/admin/login" : "/api/auth/login";
        const { data } = await axiosClient.post(endpoint, { email, password });
        setAccessToken(data.accessToken);
        setUser({ id: data.id, name: data.name, email:data.email, role: data.role });
        return data;
    }

    const register = async (name, email, password, role="user") => {
        const endpoint = role === "admin" ? "/api/auth/admin/register" : "/api/auth/register";
        const { data } = await axiosClient.post(endpoint, { name, email, password });
        setAccessToken(data.accessToken);
        setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
        return data;
    }

    return (
        <AuthContext.Provider value={{ user, setIsLoading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
} 

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be within AuthProvider");
    return ctx;
}
