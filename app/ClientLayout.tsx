"use client";

import React from "react";
import Navbar from "@/app/components/navbar";
import { AuthProvider } from "@/app/context/AuthContext";

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 pt-24 pb-10">
                {children}
            </main>
        </AuthProvider>
    );
}