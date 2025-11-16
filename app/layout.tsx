import './globals.css';
import { Navbar } from './components/navbar';

export const metadata = {
    title: 'Educational Blog',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-blue2 min-h-screen text-white">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 py-10">
            {children}
        </main>
        </body>
        </html>
    );
}
