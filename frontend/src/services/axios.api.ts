import { useAuthStore } from "@/store/auth.store";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
const baseURL = `http://localhost:8000/api`;

export const api = axios.create({
    baseURL: baseURL,
});

export const authApi = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ─── Refresh-token state ──────────────────────────────────────────────────────
// A single in-flight refresh promise shared across all concurrent 401 responses.
// This prevents multiple simultaneous refresh calls (token-refresh race condition).
let refreshPromise: Promise<string> | null = null;

type RefreshResponse = {
    success: boolean;
    data: {
        id: number;
        email: string;
        name: string;
        authenticated: boolean;
        isRememberMe: boolean;
        isActive: boolean;
        isBlacklisted: boolean;
        isPremium: boolean;
        type: string;
        accessToken: string;
    };
    message: string;
};

async function refreshAccessToken(): Promise<string> {
    const { data } = await authApi.post<RefreshResponse>("/auth/refresh-token");

    const { accessToken, id, email, name, authenticated } = data.data;

    // Persist the fresh token + user info into the Zustand store
    useAuthStore.getState().setToken(accessToken);
    useAuthStore.getState().setUser({ id, email, name, authenticated });

    return accessToken;
}

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
    // Pass successful responses straight through
    (response) => response,

    async (error: AxiosError<{ type?: string }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const isExpiredToken =
            error.response?.data?.type === "EXPIRED_TOKEN_ERROR";

        // Only attempt a refresh once per request (_retry guard)
        if (isExpiredToken && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Reuse an in-flight refresh if one is already running
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken().finally(() => {
                        refreshPromise = null;
                    });
                }

                const newToken = await refreshPromise;

                // Swap in the new token and replay the original request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch {
                // Refresh failed (e.g. refresh token also expired) → log out
                useAuthStore.getState().logoutFromStore();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);
