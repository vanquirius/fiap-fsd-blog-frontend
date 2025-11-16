// lib/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach JWT or SERVER_SECRET
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("authUser");
        const user = saved ? JSON.parse(saved) : null;

        const token = user?.token;
        const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRET;

        const authToken = token || serverSecret;

        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
    }
    return config;
});

// Auto-logout on invalid token
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("authUser");
        }
        return Promise.reject(err);
    }
);

export { api };
