"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await login(form.username, form.password);
            window.location.href = "/";
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="pt-24 flex justify-center">
            <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-blue-50 focus:outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-blue-50 focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="w-full bg-navy text-white py-3 rounded-lg hover:bg-blue-900"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}