import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import PostPage from "@/app/post/[id]/page";
import { AuthProvider } from "@/app/context/AuthContext";

// Mock next/navigation (App Router API)
jest.mock("next/navigation", () => ({
    useParams: () => ({ id: "1" }),
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn(),
    }),
}));

test("renders post + comments + adds new comment", async () => {
    render(
        <AuthProvider>
            <PostPage />
        </AuthProvider>
    );

    // Post loads
    expect(await screen.findByText("Post Title")).toBeInTheDocument();

    // Existing comment
    expect(await screen.findByText("Nice!")).toBeInTheDocument();

    // Add comment
    fireEvent.change(screen.getByPlaceholderText(/write a comment/i), {
        target: { value: "New comment!" }
    });

    fireEvent.click(screen.getByRole("button", { name: /post comment/i }));

    // New comment appears
    expect(await screen.findByText("New comment!")).toBeInTheDocument();
});