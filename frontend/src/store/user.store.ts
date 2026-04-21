import { getAllUsersApi } from "@/services/user.api";
import { create } from "zustand";
import { registerReset } from "@/store";

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

const initialState = {
    users: [],
    hasMore: false,
    isLoading: false,
    error: null,
    nextCursor: null,
};

export const useUserStore = create<UserStore>((set) => {
    const store = {
        ...initialState,

        fetchUsers: async (q: string | null, cursor: string | null) => {
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

        reset: () => set(initialState),
    };

    registerReset(store.reset);
    return store;
});
