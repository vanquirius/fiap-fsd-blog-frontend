"use client";

import React from "react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const router = useRouter();

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Fetch post details
    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error("Failed to load post:", err);
                setError("Could not load this post.");
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [id]);

    // Save edited post
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!post) return;

        setSaving(true);
        setError("");

        try {
            await api.put(`/posts/${id}`, {
                title: post.title,
                content: post.content,
                author: post.author
            });

            router.push(`/post/${id}`);
        } catch (err) {
            console.error("Failed to update:", err);
            setError("Failed to update post.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-white">
                Loading post...
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex justify-center items-center text-white">
                Post not found.
            </div>
        );
    }

    return (
        <div className="p-6 flex justify-center pt-16">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

                {error && (
                    <p className="text-red-600 mb-4 text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={post.title}
                            onChange={(e) =>
                                setPost({ ...post, title: e.target.value })
                            }
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Content</label>
                        <textarea
                            value={post.content}
                            onChange={(e) =>
                                setPost({ ...post, content: e.target.value })
                            }
                            className="w-full p-2 border rounded bg-gray-100 min-h-[200px]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800 transition disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}