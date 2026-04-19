import { create } from "zustand";
import { getAllAudiosApi } from "../services/audio.api";

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

export const useAllAudioStore = create<AudioStore>((set) => ({
    allAudiosData: [],
    isLoading: false,
    hasMore: false,
    nextCursor: null,

    fetchAllAudios: async (q, cursor) => {
        set({ isLoading: true });
        try {
            const res = await getAllAudiosApi(q, cursor);
            const data = res.data; // AudioPage
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

    reset: () => set({ allAudiosData: [], hasMore: false, nextCursor: null }),
}));
