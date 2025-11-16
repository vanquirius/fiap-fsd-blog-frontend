// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
}

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            try {
                const res = await api.get("/posts"); // uses token automatically
                setPosts(res.data);
            } catch (error) {
                console.error("Failed to load posts", error);
                setPosts([]); // fallback to empty
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="text-white text-center pt-32">
                Loading posts...
            </div>
        );
    }

    return (
        <div className="pt-16 max-w-4xl mx-auto px-6">
            {posts.map(post => (
                <div
                    key={post._id}
                    className="bg-white p-6 rounded-xl shadow mb-6"
                >
                    <h2 className="text-xl font-bold text-navy">{post.title}</h2>
                    <p className="text-gray-700 mt-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mt-3">
                        Author: {post.author}
                    </p>
                </div>
            ))}

            {posts.length === 0 && (
                <p className="text-white text-center text-lg">
                    No posts found.
                </p>
            )}
        </div>
    );
}
