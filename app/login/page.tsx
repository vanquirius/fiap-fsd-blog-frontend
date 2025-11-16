"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const { login, error, user, loading } = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });

    useEffect(() => {
        if (!loading && user) router.push("/");
    }, [user, loading, router]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await login(form.username, form.password);
    }

    return (
        <div className="flex justify-center pt-20 px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-navy mb-6 text-center">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />

                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue2 text-white py-2 rounded-lg font-semibold hover:bg-navy transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}