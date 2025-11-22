"use client";

import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        // Expect login to return an error message string on failure, or falsy on success.
        const err = await login(identifier, password);

        if (err) {
            setErrorMessage(err); // show error on screen
            return;
        }

        router.push("/");
    };

    return (
        // NOTE: changed items-center -> items-start and increased top padding.
        // This keeps the box horizontally centered but closer to the navbar.
        <div className="flex justify-center items-start min-h-screen bg-navy pt-20">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-center text-xl font-semibold mb-4">Login</h2>

                {errorMessage && (
                    <p className="text-red-600 text-center mb-3">
                        {errorMessage}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username or email"
                        className="w-full p-2 border rounded bg-gray-100"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded bg-gray-100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue2 text-white py-2 rounded hover:bg-navy transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
