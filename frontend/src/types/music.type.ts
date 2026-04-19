export type Prompt = {
    id: number;
    userId: number;
    prompt: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    title: string;
    createdAt: string;
    updatedAt: string;
    startedAt: string | null;
    completedAt: string | null;
    attempts: number;
    maxAttempts: number;
    result: {
        audioIds: number[];
    } | null;
    errorMessage: string | null;
    eventEmitted: boolean;
    jobId: string;
    priority: number;
    audios: Audio[];
};

export type Audio = {
    id: number;
    userId: number;
    promptId: number;
    title: string;
    inputPrompt: string;
    audioUrl: string;
    hlsUrl: string | null;
    thumbnail: string | null;
    durationMs: number;
    playCount: number;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    prompt: Prompt;
};

export type AllAudioData = {
    results: Audio[];
    hasMore: boolean;
    nextCursor: string;
};
