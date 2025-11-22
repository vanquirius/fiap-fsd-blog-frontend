// app/components/Protected.tsx
"use client";
import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // allow auth to restore from localStorage (small delay)
        const t = setTimeout(() => setChecked(true), 120);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (checked && !user) {
            router.push("/login");
        }
    }, [checked, user, router]);

    // while waiting for restore, return null (or spinner)
    if (!checked || !user) return null;

    return <>{children}</>;
}
