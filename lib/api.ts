// lib/api.ts
import axios from "axios";

// Create Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// --- GLOBAL LOGOUT HANDLER ---
let logoutHandler: (() => void) | null = null;

/** AuthProvider registers its logout function here */
export const setLogoutHandler = (fn: () => void) => {
    logoutHandler = fn;
};

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use((config) => {
    const isCommentsRoute = config.url?.includes("/comments");

    if (isCommentsRoute) {
        config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_SERVER_SECRET}`;
        return config;
    }

    if (config.method === "get") {
        config.headers.Authorization = `Bearer ${process.env.NEXT_PUBLIC_SERVER_SECRET}`;
    } else {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
    (res) => res,
    (err) => {
        // JWT expired or missing -> auto logout
        if (err?.response?.status === 401) {
            if (logoutHandler) logoutHandler();
        }
        return Promise.reject(err);
    }
);

export default api;
