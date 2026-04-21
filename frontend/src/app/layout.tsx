import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";

const geistSans = localFont({
    src: [
        { path: "../../public/fonts/Geist-Regular.woff2", weight: "400" },
        { path: "../../public/fonts/Geist-Bold.woff2", weight: "700" },
    ],
    variable: "--font-geist-sans",
    display: "swap",
});

const geistMono = localFont({
    src: [
        { path: "../../public/fonts/GeistMono-Regular.woff2", weight: "400" },
    ],
    variable: "--font-geist-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "MusicGPT",
    description: "MusicGPT Generation Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang='en'
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className='min-h-screen bg-black text-white'>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
