"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getMeApi } from "@/services/auth.api";
import Header from "@/components/Header";
import DesktopNavigation from "@/components/Sidebar";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const setUser = useAuthStore((s) => s.setUser);
    const setToken = useAuthStore((s) => s.setToken);
    const accessToken = useAuthStore((s) => s.accessToken);
    const isAuthenticating = useAuthStore((s) => s.isAuthenticating);
    const setAuthenticating = useAuthStore((s) => s.setAuthenticating);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await getMeApi();

                setUser(response.data);
                setToken(response.data?.accessToken ?? null);
            } catch (err) {
                setUser(null);
                setToken(null);
            } finally {
                setAuthenticating(false);
            }
        };

        initAuth();
    }, [setUser, setAuthenticating, setToken]);

    if (isAuthenticating) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <div className='w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
            </div>
        );
    }
    return (
        <main className='min-h-screen bg-black text-white'>
            <Header />
            <DesktopNavigation />
            {children}
        </main>
    );
}
