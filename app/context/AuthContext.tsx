"use client";

import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { setLogoutHandler } from "../../lib/api";

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<string | null>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage (persistent login)
    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.username) setUser(parsed);
            }
        } catch {
            localStorage.removeItem("user");
        }

        setLoading(false);
    }, []);

    // --- MANUAL LOGOUT (logout button) ---
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        router.push("/");
    };

    // --- SESSION EXPIRED LOGOUT (401 handler) ---
    const sessionLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        router.push("/login");
    };

    useEffect(() => {
        setLogoutHandler(() => sessionLogout);
    }, [sessionLogout]);

    // --- LOGIN ---
    const login = async (identifier: string, password: string) => {
        try {
            const payload = { username: identifier, password };
            const response = await api.post("/auth/login", payload);

            const username =
                response?.data?.username ||
                response?.data?.user?.username ||
                identifier;

            const loggedUser = { username };
            setUser(loggedUser);
            localStorage.setItem("user", JSON.stringify(loggedUser));

            const token =
                response?.data?.token ||
                response?.data?.accessToken ||
                null;

            if (token) localStorage.setItem("token", token);

            return null;
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Invalid username or password";

            return msg;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};