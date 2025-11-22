"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "./context/AuthContext";

interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
}

export default function HomePage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function fetchAll() {
        try {
            const response = await api.get("/posts");
            setPosts(response.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchFiltered(query: string) {
        try {
            const response = await api.get(`/posts/search?query=${query}`);
            setPosts(response.data);
        } catch (err) {
            console.error("Search error:", err);
        }
    }

    async function deletePost(id: string) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await api.delete(`/posts/${id}`);
            setPosts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (search.trim() === "") fetchAll();
            else fetchFiltered(search.trim());
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* 🔍 Search bar */}
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 rounded-lg mb-4 border shadow bg-white"
                />

                {/* POSTS */}
                {posts.map((post) => (
                    <a
                        href={`/post/${post._id}`}
                        key={post._id}
                        className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
                    >
                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>

                        <p className="text-sm text-gray-500">
                            Author: <span className="font-medium">{post.author}</span>
                        </p>

                        <p>
                            {post.content.length > 200
                                ? post.content.slice(0, 200) + "..."
                                : post.content}
                        </p>

                        {user && (
                            <div className="flex gap-3 pt-4">

                                {/* EDIT */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.location.href = `/post/${post._id}/edit`;  // ✅ FIXED
                                    }}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Edit
                                </button>

                                {/* DELETE */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        deletePost(post._id);
                                    }}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </a>
                ))}

                {posts.length === 0 && (
                    <p className="text-center text-white opacity-80">No posts found.</p>
                )}
            </div>
        </div>
    );
}