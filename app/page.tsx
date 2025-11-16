'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Post {
    _id: string;
    title: string;
    content: string;
    author?: string;
}

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/posts')
            .then(res => setPosts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>

            {loading && (
                <p className="text-light mt-4">Carregando posts...</p>
            )}

            <div className="mt-8 space-y-6">
                {posts.map((p) => (
                    <article
                        key={p._id}
                        className="bg-light text-navy p-6 rounded-xl shadow-md border-l-4 border-blue2 hover:shadow-xl transition"
                    >
                        <h2 className="text-2xl font-bold mb-2">{p.title}</h2>

                        <p className="text-gray-700 mb-4">{p.content}</p>

                        <span className="text-sm text-gray-500">
                            Author: {p.author || "Unknown"}
                        </span>
                    </article>
                ))}
            </div>
        </>
    );
}
