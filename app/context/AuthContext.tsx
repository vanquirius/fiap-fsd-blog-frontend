"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, setApiToken } from "../../lib/api";

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Restore stored user on startup (only if it has a username)
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.username) {
                    setUser(parsed);
                } else {
                    // if stored exists but is empty object, remove it to avoid confusion
                    localStorage.removeItem("user");
                }
            }
        } catch (err) {
            localStorage.removeItem("user");
        }
    }, []);

    /**
     * Robust LOGIN:
     * - identifier may be username OR email
     * - try to extract username from several possible backend response shapes
     * - fallback to identifier if backend doesn't return a username
     */
    const login = async (identifier: string, password: string) => {
        const payload = { username: identifier, password }; // matches your backend/postman
        const response = await api.post("/auth/login", payload);

        // DEBUG: log raw response so you can inspect the exact shape in DevTools
        console.log("AuthContext.login: raw response:", response?.data);

        // Try multiple possible locations for username:
        const usernameFromTop = response?.data?.username;
        const usernameFromUserObj = response?.data?.user?.username;
        const maybeUserObj = response?.data?.user;

        // Choose a username in priority order
        const finalUsername =
            usernameFromTop ||
            usernameFromUserObj ||
            (typeof maybeUserObj === "string" ? maybeUserObj : undefined) ||
            identifier; // fallback to what user typed

        // Ensure we only store an object with a non-empty username
        const loggedUser = { username: finalUsername };

        console.log("AuthContext.login: resolved username ->", finalUsername);

        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));

        // Token handling
        const token = response?.data?.token ?? response?.data?.accessToken ?? null;
        if (token) setApiToken(token);
        else console.warn("AuthContext.login: no token found in response");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        setApiToken(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
