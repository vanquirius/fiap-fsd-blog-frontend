import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

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
        <ClientLayout>
            {children}
        </ClientLayout>
        </body>
        </html>
    );
}