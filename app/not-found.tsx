import React from "react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold mb-4">404</h1>
            <p className="text-lg opacity-80">
                This page could not be found.
            </p>
        </div>
    );
}