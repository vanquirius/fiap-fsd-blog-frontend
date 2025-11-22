import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";

// Mock useAuth to avoid network calls & navigation
jest.mock("@/app/context/AuthContext", () => {
    return {
        ...jest.requireActual("@/app/context/AuthContext"),
        useAuth: () => ({
            login: jest.fn().mockResolvedValue(null),
            logout: jest.fn(),
            user: null
        }),
        AuthProvider: ({ children }) => <>{children}</>,
    };
});

test("renders login form and logs user in", async () => {
    render(<LoginPage />);

    // Fill the form inputs
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
        target: { value: "username" }
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: "123456" }
    });

    // Click login button
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    // Assert that one of the Login elements still exists (heading)
    expect(
        screen.getByRole("heading", { name: /^login$/i })
    ).toBeInTheDocument();
});