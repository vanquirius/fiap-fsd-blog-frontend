/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "jsdom",

    // Load Jest setup file (fetch polyfills + MSW initialization)
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

    // Resolve import aliases like "@/app/..."
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "^next/navigation$": "<rootDir>/__mocks__/next/navigation.js",
    },

    // Transform TS/JS with Babel or SWC if needed
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },

    // Ignore Next.js build output
    testPathIgnorePatterns: [
        "<rootDir>/.next/",
        "<rootDir>/node_modules/"
    ],
};