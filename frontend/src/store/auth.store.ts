import { create } from "zustand";

export type AuthUser = {
    id: number;
    email: string;
    name: string;
    authenticated: boolean;
};

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticating: boolean;

    setAuthenticating: (isAuthenticating: boolean) => void;
    setUser: (user: AuthUser | null) => void;
    setToken: (token: string | null) => void;
    logoutFromStore: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticating: true,

    setUser: (user) => set({ user }),
    setToken: (accessToken) => set({ accessToken }),
    setAuthenticating: (isAuthenticating) => set({ isAuthenticating }),

    logoutFromStore: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticating: false,
        }),
}));
