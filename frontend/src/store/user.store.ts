import { getAllUsersApi } from "@/services/user.api";
import { create } from "zustand";

export interface UserResult {
    id: number;
    name: string;
    email: string;
    isPremium: boolean;
    isActive: boolean;
    isBlacklisted: boolean;
    createdAt: string;
}

export interface UserPage {
    results: UserResult[];
    hasMore: boolean;
    nextCursor: string | null;
}

interface UserStore {
    users: UserResult[];
    isLoading: boolean;
    hasMore: boolean;
    error: string | null;
    fetchUsers: (
        q: string | null,
        cursor: string | null,
    ) => Promise<string | null>;
    reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    isLoading: false,
    hasMore: false,
    error: null,

    fetchUsers: async (q, cursor) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getAllUsersApi(q, cursor);
            set({
                users: data.results,
                hasMore: data.hasMore,
            });
            return data.nextCursor;
        } catch (err) {
            set({ error: "Failed to fetch users" });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({ users: [], hasMore: false, error: null }),
}));
