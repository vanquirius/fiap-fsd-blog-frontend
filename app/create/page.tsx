"use client";

import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../app/context/AuthContext";
import ProtectedRoute from "../components/Protected";

export default function CreatePostPage() {
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: "",
        content: ""
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!user) return;

        try {
            await api.post("/posts", {
                title: form.title,
                content: form.content,
                author: user.username      // 👈 Auto-injected author
            });

            alert("Post created successfully!");
            window.location.href = "/";
        } catch (err) {
            console.error(err);
            alert("Failed to create post");
        }
    }

    return (
        <ProtectedRoute>
            <div className="pt-24 max-w-3xl mx-auto px-6">
                <div className="bg-white p-8 shadow-xl rounded-xl">

                    <h1 className="text-3xl font-bold text-navy mb-6">
                        Create Post
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue2"
                                placeholder="Enter the title"
                                required
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
                                    setForm({ ...form, content: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue2"
                                placeholder="Write your post..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue2 text-white py-2 rounded-lg font-semibold hover:bg-navy transition"
                        >
                            Publish
                        </button>
                    </form>

                </div>
            </div>
        </ProtectedRoute>
    );
}
