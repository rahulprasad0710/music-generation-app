"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getMeApi } from "@/services/auth.api";

export const useAuthInit = () => {
    const setUser = useAuthStore((s) => s.setUser);
    const setLoading = useAuthStore((s) => s.setAuthenticating);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await getMeApi();

                setUser(response.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [setUser, setLoading]);
};
