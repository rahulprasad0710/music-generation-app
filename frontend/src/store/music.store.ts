import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type GenerationStatus =
    | "PENDING"
    | "QUEUED"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";

export interface Audio {
    id: number;
    title: string;
    audioUrl: string;
    durationMs: number | null;
    promptId: number;
}

export interface PromptRecord {
    id: number;
    prompt: string;
    title: string | null;
    status: GenerationStatus;
    progress: number;
    audios: Audio[];
    error: string | null;
    createdAt: string;
}

interface MusicStore {
    prompts: PromptRecord[];
    // Actions
    addPrompt: (p: PromptRecord) => void;
    setProcessing: (promptId: number) => void;
    setProgress: (promptId: number, progress: number) => void;
    setCompleted: (promptId: number, audios: Audio[]) => void;
    setFailed: (promptId: number, error: string) => void;
    hydratePrompts: (prompts: PromptRecord[]) => void;
}

export const useMusicStore = create<MusicStore>()(
    immer((set) => ({
        prompts: [],

        addPrompt: (p) =>
            set((s) => {
                s.prompts.unshift(p);
            }),

        setProcessing: (promptId) =>
            set((s) => {
                const p = s.prompts.find((x) => x.id === promptId);
                if (p) {
                    p.status = "PROCESSING";
                    p.progress = 0;
                }
            }),

        setProgress: (promptId, progress) =>
            set((s) => {
                const p = s.prompts.find((x) => x.id === promptId);
                if (p) p.progress = progress;
            }),

        setCompleted: (promptId, audios) =>
            set((s) => {
                const p = s.prompts.find((x) => x.id === promptId);
                if (p) {
                    p.status = "COMPLETED";
                    p.audios = audios;
                    p.progress = 100;
                }
            }),

        setFailed: (promptId, error) =>
            set((s) => {
                const p = s.prompts.find((x) => x.id === promptId);
                if (p) {
                    p.status = "FAILED";
                    p.error = error;
                }
            }),

        hydratePrompts: (prompts) =>
            set((s) => {
                s.prompts = prompts;
            }),
    })),
);
