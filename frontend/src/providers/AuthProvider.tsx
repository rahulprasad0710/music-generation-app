"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getMeApi } from "@/services/auth.api";
import Header from "@/components/Header";
import DesktopNavigation from "@/components/Sidebar";
import { Toaster } from "sonner";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const setUser = useAuthStore((s) => s.setUser);
    const setToken = useAuthStore((s) => s.setToken);
    const isAuthenticating = useAuthStore((s) => s.isAuthenticating);
    const setAuthenticating = useAuthStore((s) => s.setAuthenticating);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await getMeApi();

                setUser(response.data);
                setToken(response.data?.accessToken ?? null);
            } catch (error) {
                setUser(null);
                setToken(null);
            } finally {
                setAuthenticating(false);
            }
        };

        initAuth();
    }, [setUser, setAuthenticating, setToken]);

    return (
        <main className='min-h-screen bg-black text-white'>
            <Header />
            <DesktopNavigation />
            {children}
            <Toaster theme='dark' richColors position='top-right' />
        </main>
    );
}
