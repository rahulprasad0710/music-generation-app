import { create } from "zustand";
import { getAllAudiosApi } from "../services/audio.api";
import { registerReset } from "@/store";
import { Audio } from "@/types/music.type";

interface AudioStore {
    allAudiosData: Audio[];
    isLoading: boolean;
    hasMore: boolean;
    nextCursor: string | null;
    fetchAllAudios: (
        q: string | null,
        cursor: string | null,
    ) => Promise<string | null>;
    reset: () => void;
}

const initialState = {
    allAudiosData: [],
    isLoading: false,
    hasMore: false,
    nextCursor: null,
};

export const useAllAudioStore = create<AudioStore>((set) => {
    const store = {
        ...initialState,

        fetchAllAudios: async (q: string | null, cursor: string | null) => {
            set({ isLoading: true });
            try {
                const res = await getAllAudiosApi(q, cursor);
                const data = res.data;
                set({
                    allAudiosData: data.results,
                    hasMore: data.hasMore,
                    nextCursor: data.nextCursor,
                });
                return data.nextCursor;
            } catch (err) {
                console.error(err);
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
