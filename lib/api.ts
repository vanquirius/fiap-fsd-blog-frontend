import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add token automatically
api.interceptors.request.use((config) => {
    const token = process.env.NEXT_PUBLIC_SERVER_SECRET;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
