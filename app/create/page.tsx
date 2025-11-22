"use client";
import React from "react";
import { useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../app/context/AuthContext";
import ProtectedRoute from "../components/Protected";

export default function CreatePostPage() {
    const { user } = useAuth();

    const [form, setForm] = useState({
        title: "",
        content: "",
    });
    const [loading, setLoading] = useState(false);

    // helper: attempt to get username from different places
    function resolveUsername(): string | null {
        // 1) prefer user from context
        if (user?.username) return user.username;

        // 2) fallback: localStorage (stringified user object)
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    if (parsed?.username) return parsed.username;
                } catch (err) {
                    console.warn("Failed parsing stored user:", err);
                }
            }
        }

        // 3) nothing found
        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const author = resolveUsername();

        console.log("CreatePost: resolved user context:", user);
        console.log("CreatePost: resolved author fallback:", author);

        if (!author) {
            setLoading(false);
            alert(
                "Could not determine author. Make sure you're logged in. Check console for details."
            );
            return;
        }

        const payload = {
            title: form.title,
            content: form.content,
            author,
        };

        console.log("CreatePost: sending payload:", payload);

        try {
            const res = await api.post("/posts", payload);
            console.log("CreatePost: server response:", res.data);
            alert("Post created successfully!");
            window.location.href = "/";
        } catch (err: any) {
            console.error("CreatePost: failed", err, err?.response?.data);
            alert(
                "Failed to create post: " +
                (err?.response?.data?.message || err?.message || "Unknown")
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <ProtectedRoute>
            <div className="pt-24 max-w-3xl mx-auto px-6">
                <div className="bg-white p-8 shadow-xl rounded-xl">
                    <h1 className="text-3xl font-bold text-navy mb-6">Create Post</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                value={form.title}
                                onChange={(e) =>
                                    setForm((s) => ({ ...s, title: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue2"
                                placeholder="Enter the title"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                            </label>
                            <textarea
                                value={form.content}
                                onChange={(e) =>
                                    setForm((s) => ({ ...s, content: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue2"
                                placeholder="Write your post..."
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full bg-blue2 text-white py-2 rounded-lg font-semibold hover:bg-navy transition ${
                                loading ? "opacity-60 pointer-events-none" : ""
                            }`}
                        >
                            {loading ? "Publishing..." : "Publish"}
                        </button>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
