import { getUserAudiosApi, getAllAudiosApi } from "@/services/audio.api";
import { create } from "zustand";
import { GenerationStatus } from "./music.store";
import { AllAudioData } from "@/types/music.type";
import { registerReset } from ".";

export interface AudioGeneration {
    id: number;
    userId: number;
    promptId: number;
    title: string;
    version: string;
    inputPrompt: string;
    audioUrl: string;
    hlsUrl: string | null;
    thumbnail: string | null;
    durationMs: number;
    playCount: number;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    progress: number;
    status: GenerationStatus;
}

interface AudioStore {
    generations: AudioGeneration[];
    isLoading: boolean;
    error: string | null;
    currentlyPlayingId: number | null;
    fetchGenerations: () => Promise<void>;
    setCurrentlyPlaying: (id: number) => void;
    reset: () => void;
}

export function extractVersion(title: string): string {
    const match = title.match(/version\s+([\w]+)/i);
    if (match) return `v${match[1]}`;
    const romanMatch = title.match(/—\s*Version\s+([IVXivx]+)/i);
    if (romanMatch) return `Version ${[1]}`;
    return "v1";
}

function normalizeGeneration(raw: Record<string, unknown>): AudioGeneration {
    return {
        id: raw.id as number,
        userId: raw.userId as number,
        promptId: raw.promptId as number,
        title: raw.title as string,
        version: extractVersion(raw.title as string),
        inputPrompt: raw.inputPrompt as string,
        audioUrl: raw.audioUrl as string,
        hlsUrl: (raw.hlsUrl as string | null) ?? null,
        thumbnail: (raw.thumbnail as string | null) ?? null,
        durationMs: raw.durationMs as number,
        playCount: raw.playCount as number,
        likeCount: raw.likeCount as number,
        createdAt: raw.createdAt as string,
        updatedAt: raw.updatedAt as string,
        progress: raw.progress as number,
        status: raw.status as GenerationStatus,
    };
}

const initialState = {
    generations: [],
    isLoading: false,
    error: null,
    currentlyPlayingId: null,
};

export const useAudioStore = create<AudioStore>((set) => {
    const store = {
        ...initialState,

        fetchGenerations: async () => {
            set({ isLoading: true, error: null });
            try {
                const response = await getUserAudiosApi();
                const generations: AudioGeneration[] = response?.data?.map(
                    (item) => normalizeGeneration(item),
                );
                set({ generations, isLoading: false });
            } catch (err) {
                set({
                    error:
                        err instanceof Error ? err.message : "Failed to fetch",
                    isLoading: false,
                });
            }
        },

        setCurrentlyPlaying: (id: number) => set({ currentlyPlayingId: id }),

        reset: () => set(initialState), // 👈 was missing
    };

    registerReset(store.reset);
    return store;
});
