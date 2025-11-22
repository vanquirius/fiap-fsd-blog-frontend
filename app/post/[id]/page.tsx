"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface Comment {
    _id: string;
    author: string;
    text: string;
    createdAt: string;
}

export default function PostPage() {
    const { id } = useParams();
    const { user } = useAuth();

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const postRes = await api.get(`/posts/${id}`);
                const commentsRes = await api.get(`/posts/${id}/comments`);

                setPost(postRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                console.error("Failed to load post:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await api.post(`/posts/${id}/comments`, {
                text: newComment,
                username: user?.username || "Anonymous",
            });

            setNewComment("");

            const updated = await api.get(`/posts/${id}/comments`);
            setComments(updated.data);
        } catch (err) {
            console.error("Failed to post comment:", err);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <p className="p-4">Loading...</p>;
    if (!post) return <p className="p-4">Post not found.</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow mt-10">
            {/* Post title */}
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

            {/* Post author */}
            <p className="text-gray-600 mb-6">
                <span className="font-semibold">Author: </span>
                {post.author || "Unknown"}
            </p>

            {/* Post content */}
            <p className="whitespace-pre-line text-gray-800 mb-10">
                {post.content}
            </p>

            {/* Comments header */}
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>

            {/* Existing comments */}
            {comments.length === 0 && (
                <p className="text-gray-500 mb-6">No comments yet.</p>
            )}

            <div className="space-y-4 mb-10">
                {comments.map((c) => (
                    <div
                        key={c._id}
                        className="border p-4 rounded-lg bg-gray-50"
                    >
                        <p className="text-sm font-semibold text-blue-700">
                            {c.author}
                        </p>
                        <p className="mt-1">{c.text}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            {new Date(c.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Comment form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    className="w-full p-3 border rounded bg-gray-100"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue2 text-white px-4 py-2 rounded hover:bg-navy transition disabled:opacity-50"
                >
                    {submitting ? "Posting..." : "Post Comment"}
                </button>
            </form>
        </div>
    );
}