/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                navy: "#0C2B4E",
                blue2: "#1A3D64",
                brown: "#1D546C",
                light: "#F4F4F4"
            }
        }
    },
    plugins: []
}