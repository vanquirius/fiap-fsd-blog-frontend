'use client';
import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full bg-light shadow-md border-b border-gray-300 z-50">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">

                <Link href="/" className="text-2xl font-bold text-navy">
                    Educational Blog
                </Link>

                <div className="flex items-center gap-6 text-navy font-medium">
                    <Link href="/" className="hover:text-blue2 transition">Home</Link>
                    <Link href="/new" className="hover:text-blue2 transition">Create Post</Link>

                    <button className="bg-blue2 text-white px-4 py-2 rounded-lg hover:bg-navy transition">
                        Login
                    </button>
                </div>
            </div>
        </nav>
    );
}
