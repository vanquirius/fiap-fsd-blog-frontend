import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "./components/navbar";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
    title: "Educational Blog",
    description: "A simple blog with posts and admin area",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-gray-50 text-gray-900">

        <AuthProvider>

            {/* Navbar fixed at top */}
            <Navbar />

            {/* Add padding so content does not hide under navbar */}
            <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
                {children}
            </main>

        </AuthProvider>

        </body>
        </html>
    );
}