"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
    username: string;
    token: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
    loading: true,
    error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("authUser");
        if (saved) setUser(JSON.parse(saved));
        setLoading(false);
    }, []);

    async function login(username: string, password: string) {
        try {
            setError(null);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid credentials");
                return;
            }

            const authUser = { username: data.username, token: data.token };

            localStorage.setItem("authUser", JSON.stringify(authUser));
            setUser(authUser);
        } catch {
            setError("Server error");
        }
    }

    function logout() {
        localStorage.removeItem("authUser");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
